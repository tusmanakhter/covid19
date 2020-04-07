import React, { useState, useEffect } from 'react'
import Layout from '../layout'
import Table from './table';
import Stats from './stats';
import Confirmed from './confirmed-chart';
import Deaths from './deaths-chart';
import Hospitalizations from './hospitalizations-chart';
import Testing from './testing-chart';
import Summary from './summary-chart';
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
  const [confirmedData, setConfirmedData] = useState();
  const [deathsData, setDeathsData] = useState();
  const [analysisData, setAnalysisData] = useState();
  const [hospitalData, setHospitalData] = useState();
  const [summaryData, setSummaryData] = useState();

  useEffect(() => {
    (async () => {
      const data = await ky.get(`${process.env.API_URL}/api/quebec`).json();
      const dict = data.casesPerRegion.data.reduce((map, obj) => {
        const key = getKey(obj.region);
        map[key] = { ...obj };
        return map;
      }, {});
      setConfirmedData(data.confirmed.data);
      setDeathsData(data.deaths.data);
      setAnalysisData(data.analysis.data);
      setHospitalData(data.hospitalizations.data);
      setTableData(data.casesPerRegion.data);
      setAgeData(data.byAge.data);
      setMapData(dict);
      setStats(data.summary);
      setSummaryData(data);
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
                    <Table data={tableData} />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem grow={2}>
              <EuiFlexGroup direction="column" gutterSize="s">
                <EuiFlexItem>
                  <EuiPanel paddingSize="none">
                    <Leaflet data={mapData} />
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiPanel>
                    <Summary data={summaryData} />
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Confirmed data={confirmedData} />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Deaths data={deathsData} />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Hospitalizations data={hospitalData} />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Testing data={analysisData} />
          </EuiPanel>
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
