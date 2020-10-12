import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../layout'
import Locations from './locations';
import Stats from './stats';
import Leaflet from './leaflet';
import Chart from './chart';
import DatePicker from './date-picker';
import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule } from '@elastic/eui';
import { addLatestStats, getCountryData, getProvinceData } from '../../helpers/stats';
import archivedData from "../../../../data/global.json";
import './app.css';

const addAllLatestStats = (data, dateIndex) => {
  if (data) {
    const global = data.global;

    Object.entries(data.locations).forEach(([key, location]) => {
      const latest = addLatestStats(location, global, dateIndex);
      data.locations[key].latest = latest;
    });

    const latest = addLatestStats(global, global, dateIndex);
    data.global.latest = latest;
  }
};

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
  const [dateIndex, setDateIndex] = useState();
  const [historical, setHistorical] = useState(false);

  const setCurrentData = useCallback((data, dateIndex) => {
    addAllLatestStats(data, dateIndex);

    const locationsValues = Object.values(data.locations).filter(location => location.location);

    const countryData = getCountryData(data);
    const provinceData = getProvinceData(data);

    setMapData(locationsValues);
    setCountryData(countryData);
    setProvinceData(provinceData);
    setTableData(countryData);
  }, []);

  useEffect(() => {
    (async () => {
      const data = archivedData;
      const dateIndex = data.global.history.length - 1;
      setCurrentData(data, dateIndex);
      setSelected('Global');
      setSelectedData(data.global);
      setDateIndex(dateIndex);
      setData(data);
    })();
  }, [setCurrentData]);

  const selectRow = useCallback((selectedRow) => {
    setSelected(selectedRow);
    setSelectedData(data.locations[selectedRow]);
    if (selectedRow in provinceData) {
      setTableData(provinceData[selectedRow]);
      setIsProvince(true);
    }
  }, [data, provinceData]);

  const setDisplayDate = useCallback((date) => {
    const formattedDate = date.format('M/D/YY');
    const newData = {
      locations: {}
    };

    newData.global = data.global;
    const index = data.global.history.findIndex(histData => histData.date === formattedDate);
    if (index !== -1) {
      newData.global.latest = data.global.history[index];
      setDateIndex(index);
  
      Object.entries(data.locations).forEach(([key, location]) => {
        const latest = location.history[index];
        newData.locations[key] = location;
        newData.locations[key].latest = latest;
      });
    
      const historical = index !== data.global.history.length - 1;
  
      setCurrentData(newData, index);
      setHistorical(historical);
    }
  }, [data, setCurrentData]);

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
      <div>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiPanel className="leftBar">
              <Stats data={selectedData} onBack={resetSelected} />
              <EuiHorizontalRule margin="s"/>
              <DatePicker setDisplayDate={setDisplayDate} data={data} />
              <Locations
                data={tableData} 
                onRowClick={selectRow} 
                isProvince={isProvince} 
                displayStat={displayStat} 
                setDisplayStat={setDisplayStat} 
                selected={selected}
                historical={historical}
              />
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
                  <Chart title={selected} data={selectedData} dateIndex={dateIndex} />
                </EuiPanel>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </Layout>
  )
}

export default App;
