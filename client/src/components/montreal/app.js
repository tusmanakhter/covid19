import React, { useState, useEffect } from 'react'
import Layout from '../layout'
import Table from './table';
import Stats from './stats';
import Leaflet from './leaflet';
import Age from './Age';
import ky from 'ky';
import { EuiPanel, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import getKey from '../../helpers/key';

const App = () => {
  const [mapData, setMapData] = useState();
  const [stats, setStats] = useState();
  const [tableData, setTableData] = useState([]);
  const [ageData, setAgeData] = useState();
  const [mouseEnter, setMouseEnter] = useState();
  const [mouseLeave, setMouseLeave] = useState();

  const onMouseEnter = (key) => {
    setMouseEnter(key);
    setMouseLeave(null);
  }

  const onMouseLeave = (key) => {
    setMouseEnter(null);
    setMouseLeave(key);
  }

  useEffect(() => {
    (async () => {
      const data = await ky.get(`${process.env.API_URL}/api/montreal`).json();
      const dict = data.locations.reduce((map, obj) => {
        const key = getKey(obj.location);
        map[key] = { ...obj };
        return map;
      }, {});
      setTableData(data.locations);
      setAgeData(data.ages);
      setMapData(dict);
      setStats({
        confirmed: data.confirmed, 
        perHundred: data.perHundred,
        quebecCases: data.quebecCases,
        canadaCases: data.canadaCases,
        deaths: data.deaths, 
        perHundredDeaths: data.perHundredDeaths,
        quebecDeaths: data.quebecDeaths,
        canadaDeaths: data.canadaDeaths,
        lastUpdate: data.lastUpdate,
      });
    })();
  }, []);

  return (
    <Layout>
      <EuiFlexGroup gutterSize="s" direction="column">
        <EuiFlexItem>
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={1}>
              <EuiPanel>
                <EuiFlexGroup direction="column">
                  <EuiFlexItem>
                    <Stats stats={stats} />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <Table data={tableData} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem grow={2}>
              <EuiFlexGroup direction="column" gutterSize="none">
                <EuiFlexItem>
                  <EuiPanel paddingSize="none">
                    <Leaflet data={mapData} mouseEnter={mouseEnter} mouseLeave={mouseLeave} />
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem />
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Age data={ageData} />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </Layout>
  )
}

export default App;
