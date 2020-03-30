import React, { useState, useEffect, useCallback } from 'react'
import Layout from './layout'
import SEO from './seo'
import Table from './table';
import Stats from './stats';
import Leaflet from './leaflet';
import Chart from './chart';
import ky from 'ky';
import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import '../themes/theme_light.scss';
import './app.css';

const App = () => {
  const [data, setData] = useState();
  const [countryData, setCountryData] = useState();
  const [provinceData, setProvinceData] = useState();
  const [selected, setSelected] = useState();
  const [selectedData, setSelectedData] = useState();
  const [tableData, setTableData] = useState([]);
  const [mapData, setMapData] = useState();
  const [chartData, setChartData] = useState();
  const [isProvince, setIsProvince] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await ky.get('https://covid19.tusmanakhter.com/api').json();
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
      setChartData(data.global.history);
      setCountryData(countryData);
      setProvinceData(provinceData);
      setTableData(countryData);
      setData(data);
    })();
  }, []);

  const selectRow = useCallback((selectedRow) => {
    setSelected(selectedRow);
    setSelectedData(data.locations[selectedRow]);
    setChartData(data.locations[selectedRow].history);
    if (selectedRow in provinceData) {
      setTableData(provinceData[selectedRow]);
      setIsProvince(true);
    }
  }, [data, provinceData]);

  const resetSelected = useCallback((key) => {
    if (key === 'Global') {
      setSelected(key);
      setSelectedData(data.global);
      setChartData(data.global.history);
      setTableData(countryData);
      setIsProvince(false);
    } else {
      selectRow(key);
    }
  }, [data, countryData, selectRow]);

  return (
    <Layout>
      <SEO title="Covid-19 Tracker" />
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem>
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
                      <Chart data={chartData} />
                    </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiText textAlign="center" className="footer">
              <p>Data provided by <a target="_blank" rel="noopener noreferrer" href="https://systems.jhu.edu/">JHU CSSE</a> on <a target="_blank" rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19">Github</a></p>
              <p>Icon provided by <a target="_blank" rel="noopener noreferrer" href="https://www.iconfinder.com/justicon">Just Icon</a> licensed under <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
              <p>Code available on <a target="_blank" rel="noopener noreferrer" href="https://github.com/tusmanakhter/covid19">Github</a> written by <a target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</a></p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
    </Layout>
  )
}

export default App;
