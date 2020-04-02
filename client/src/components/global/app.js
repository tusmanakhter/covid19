import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../layout'
import Table from './table';
import Stats from './stats';
import Leaflet from './leaflet';
import Chart from './chart';
import ky from 'ky';
import { EuiPanel, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

const App = () => {
  const [data, setData] = useState();
  const [countryData, setCountryData] = useState();
  const [provinceData, setProvinceData] = useState();
  const [selected, setSelected] = useState();
  const [selectedData, setSelectedData] = useState();
  const [tableData, setTableData] = useState([]);
  const [mapData, setMapData] = useState();
  const [isProvince, setIsProvince] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await ky.get('https://api.trackingcovid.info/api').json();
      const locationsArray = Object.entries(data.locations);
      const locationsValues = Object.values(data.locations).filter(location => location.location);

      const countryData = locationsArray.map(([key, value]) => {
        return {
          key,
          ...value
        }
      })
      .filter(location => location.location && location.location.province === '')
      .sort((a, b) => {
        return b.latest.confirmed - a.latest.confirmed;
      });

      const provinceData = {};
      locationsArray.map(([key, value]) => {
        return {
          key,
          ...value
        }
      })
      .filter(location => location.location && location.location.province !== '')
      .sort((a, b) => {
        return b.latest.confirmed - a.latest.confirmed;
      })
      .forEach(location => {
        if (provinceData[location.location.country] === undefined) {
          provinceData[location.location.country] = [];
        }
        provinceData[location.location.country].push(location)
      });

      setMapData(locationsValues);
      setSelected('Global');
      setSelectedData(data.global);
      setCountryData(countryData);
      setProvinceData(provinceData);
      setTableData(countryData);
      setData(data);
    })();
  }, []);

  const selectRow = useCallback((selectedRow) => {
    setSelected(selectedRow);
    setSelectedData(data.locations[selectedRow]);
    if (selectedRow in provinceData) {
      setTableData(provinceData[selectedRow]);
      setIsProvince(true);
    }
  }, [data, provinceData]);

  const resetSelected = useCallback((key) => {
    if (key === 'Global') {
      setSelected(key);
      setSelectedData(data.global);
      setTableData(countryData);
      setIsProvince(false);
    } else {
      selectRow(key);
    }
  }, [data, countryData, selectRow]);

  return (
    <Layout>
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={1}>
          <EuiPanel>
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <Stats title={selected} data={selectedData} onBack={resetSelected}/>
              </EuiFlexItem>
              <EuiFlexItem>
                <Table data={tableData} onRowClick={selectRow} isProvince={isProvince} />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem grow={2}>
          <EuiFlexGroup gutterSize="s" direction="column">
            <EuiFlexItem>
              <EuiPanel paddingSize="none">
                <Leaflet data={mapData} selectedData={selectedData} />
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel>
                <Chart title={selected} data={selectedData} />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </Layout>
  )
}

export default App;
