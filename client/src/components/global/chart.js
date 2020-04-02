import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ElasticChart,
  Settings,
  Axis,
  LineSeries,
  ScaleType,
  CurveType,
  timeFormatter
} from '@elastic/charts';
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup, EuiSwitch, EuiTitle, EuiHorizontalRule } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import './chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const Chart = ({ title, data }) => {
  const [logScale, setLogScale] = useState(false);
  const [history, setHistory] = useState();

  let scaleType;
  if (logScale) {
    scaleType = ScaleType.Log;
  } else {
    scaleType = ScaleType.Linear;
  }

  useEffect(() => {
    if (data) {
      const dataHistory = [...data.history];
      const date = (new Date()).setUTCHours(0,0,0,0);
      const latest = {
        date,
        confirmed: data.latest.confirmed,
        recovered: data.latest.recovered,
        deaths: data.latest.deaths,
      }
      dataHistory.push(latest);
      setHistory(dataHistory);
    }
  }, [data]);

  return (
    <>
      {
        history ? (
          <EuiFlexGroup direction="column">
            <EuiFlexItem grow={false}>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiTitle size="s"><h2>{title}</h2></EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSwitch
                    label="Log Scale"
                    checked={logScale}
                    onChange={() => {setLogScale(!logScale)}}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiHorizontalRule margin="none" />
            <EuiFlexItem>
              <ElasticChart className="chart">
                <Settings
                  theme={[EUI_CHARTS_THEME_LIGHT.theme]}
                  showLegend={true}
                  legendPosition="bottom"
                  showLegendDisplayValue={false}
                />
                <LineSeries
                  id="confirmed"
                  name="Confirmed"
                  xScaleType={ScaleType.Time}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["confirmed"]}
                  color={"#006BB4"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#006BB4",
                    }
                  }}
                  timeZone="GMT"
                />
                <LineSeries
                  id="recovered"
                  name="Recovered"
                  xScaleType={ScaleType.Time}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["recovered"]}
                  color={"#017D73"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#017D73",
                    }
                  }}
                  timeZone="GMT"
                />
                <LineSeries
                  id="deaths"
                  name="Deaths"
                  xScaleType={ScaleType.Time}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["deaths"]}
                  color={"#BD271E"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#BD271E",
                    }
                  }}
                  timeZone="GMT"
                />
                <Axis
                  id="bottom-axis"
                  position="bottom"
                  tickFormat={dateFormatter}
                  showGridLines
                />
                <Axis
                  id="left-axis"
                  position="left"
                  showGridLines
                  tickFormat={numberFormatter}
                />
              </ElasticChart>
            </EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          <EuiFlexGroup className="chart" alignItems="center" justifyContent="center" gutterSize="none">
            <EuiFlexItem grow={false}>
              <EuiLoadingChart size="xl" />
            </EuiFlexItem>
          </EuiFlexGroup>
        )
      }
    </>
  )
}

Chart.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string,
}

export default Chart;
