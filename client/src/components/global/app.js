import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../layout'
import Locations from './locations';
import Stats from './stats';
import Leaflet from './leaflet';
import Chart from './chart';
import ky from 'ky';
import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiLoadingSpinner } from '@elastic/eui';
import { getIncrease, getPercentTotal } from '../../helpers/stats';
import './app.css';

const addLatestStats = (location) => {
  const confirmedIncrease = getIncrease('confirmed', location);
  const recoveredIncrease =  getIncrease('recovered', location);
  const deathsIncrease =  getIncrease('deaths', location);
  const activeIncrease =  getIncrease('active', location);
  const confirmedIncreasePercent = getIncrease('confirmed', location, true);
  const recoveredIncreasePercent = getIncrease('recovered', location, true);
  const deathsIncreasePercent = getIncrease('deaths', location, true); 
  const activeIncreasePercent = getIncrease('active', location, true);
  const recoveredRate = getPercentTotal('recovered', location);
  const deathsRate = getPercentTotal('deaths', location);
  const activeRate = getPercentTotal('active', location);

  const latest = {
    ...location.latest,
    confirmedIncrease,
    recoveredIncrease,
    deathsIncrease,
    activeIncrease,
    confirmedIncreasePercent,
    recoveredIncreasePercent,
    deathsIncreasePercent,
    activeIncreasePercent,
    recoveredRate,
    deathsRate,
    activeRate,
  }

  return latest;
}

const App = () => {
  const [data, setData] = useState();
  const [countryData, setCountryData] = useState();
  const [provinceData, setProvinceData] = useState();
  const [selected, setSelected] = useState();
  const [selectedData, setSelectedData] = useState();
  const [tableData, setTableData] = useState([]);
  const [mapData, setMapData] = useState();
  const [isProvince, setIsProvince] = useState(false);
  const [displayStat, setDisplayStat] = useState('confirmed');

  useEffect(() => {
    (async () => {
      const data = await ky.get(`${process.env.API_URL}/api`).json();

      Object.entries(data.locations).forEach(([key, location]) => {
        const latest = addLatestStats(location);
        data.locations[key].latest = latest;
      });

      const latest = addLatestStats(data.global);
      data.global.latest = latest;

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
      {data ? (
        <div>
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={false}>
              <EuiPanel className="leftBar">
                <Stats data={selectedData} onBack={resetSelected}/>
                <EuiHorizontalRule margin="s"/>
                <Locations data={tableData} onRowClick={selectRow} isProvince={isProvince} displayStat={displayStat} setDisplayStat={setDisplayStat} selected={selected}/>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s" direction="column">
                <EuiFlexItem grow={4}>
                  <EuiPanel paddingSize="none">
                    <Leaflet data={mapData} selectedData={selectedData} markerType={displayStat} />
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem grow={3}>
                  <EuiPanel style={{ height: '100%', paddingBottom: 0 }}>
                    <Chart title={selected} data={selectedData} />
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      ) : (
        <div className="container">
          <EuiLoadingSpinner size="xl" />
        </div>
      )}
    </Layout>
  )
}

export default App;
