import React, { useState, useEffect } from 'react'
import Layout from '../layout'
import Table from './table';
import Stat from './stat';
import Leaflet from './leaflet';
import ky from 'ky';
import { EuiPanel, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import getKey from '../../helpers/key';

const App = () => {
  const [mapData, setMapData] = useState();
  const [total, setTotal] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [tableData, setTableData] = useState([]);
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
      const data = await ky.get('https://api.trackingcovid.info/api/montreal').json();
      const dict = data.locations.reduce((map, obj) => {
        const key = getKey(obj.location);
        map[key] = obj.confirmed;
        return map;
      }, {});
      setTableData(data.locations);
      setMapData(dict);
      setTotal(data.total);
      setLastUpdate(data.lastUpdate);
    })();
  }, []);

  return (
    <Layout>
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={1}>
          <EuiPanel>
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <Stat total={total} lastUpdate={lastUpdate} />
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
    </Layout>
  )
}

export default App;
