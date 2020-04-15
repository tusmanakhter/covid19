import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ElasticChart,
  Settings,
  Axis,
  LineSeries,
  BarSeries,
  ScaleType,
  CurveType,
  timeFormatter
} from '@elastic/charts';
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup, EuiSwitch, EuiTitle, EuiHorizontalRule } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import { getColor } from '../../helpers/color';
import './chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const Chart = ({ title, data }) => {
  const [logScale, setLogScale] = useState(false);
  const [history, setHistory] = useState();
  const [daily, setDaily] = useState(false);

  let scaleType;
  if (logScale) {
    scaleType = ScaleType.Log;
  } else {
    scaleType = ScaleType.Linear;
  }

  let ChartSeries;
  if (daily) {
    ChartSeries = BarSeries;
  } else {
    ChartSeries = LineSeries;
  }

  useEffect(() => {
    if (data) {
      const dataHistory = [...data.history];
      const date = (new Date()).setHours(0,0,0,0);
      const latest = {
        date,
        confirmed: data.latest.confirmed,
        recovered: data.latest.recovered,
        deaths: data.latest.deaths,
        active: data.latest.active,
      }
      dataHistory.push(latest);

      if (daily) {
        const dailyHistory = dataHistory.map((item, index) => {
          let previousValue
          if (index === 0) {
            previousValue = {
              confirmed: 0,
              recovered: 0,
              deaths: 0,
              active: 0,
            };
          } else {
            previousValue = dataHistory[index - 1];
          }
  
          return {
            date: item.date,
            confirmed: item.confirmed - previousValue.confirmed,
            recovered: item.recovered - previousValue.recovered,
            deaths: item.deaths - previousValue.deaths,
            active: item.active - previousValue.active,
          }
        });
        setHistory(dailyHistory);
      } else {
        setHistory(dataHistory);
      }
    }
  }, [data, daily]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  return (
    <>
      {
        history ? (
          <EuiFlexGroup direction="column" className="chart-group">
            <EuiFlexItem grow={false}>
              <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiTitle size="s"><h2>{title}</h2></EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
                    <EuiFlexItem>
                      <EuiSwitch
                        label="Daily"
                        checked={daily}
                        onChange={() => {setDaily(!daily)}}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiSwitch
                        label="Log Scale"
                        checked={logScale}
                        onChange={() => {setLogScale(!logScale)}}
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiHorizontalRule margin="none" />
            <EuiFlexItem>
              <ElasticChart className="chart main-chart">
                <Settings
                  theme={[EUI_CHARTS_THEME_LIGHT.theme]}
                  showLegend={true}
                  legendPosition="bottom"
                  showLegendDisplayValue={false}
                />
                <ChartSeries
                  id="confirmed"
                  name="Confirmed"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["confirmed"]}
                  color={getColor('confirmed')}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: getColor('confirmed'),
                    }
                  }}
                />
                <ChartSeries
                  id="recovered"
                  name="Recovered"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["recovered"]}
                  color={getColor('recovered')}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: getColor('recovered'),
                    }
                  }}
                />
                <ChartSeries
                  id="deaths"
                  name="Deaths"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["deaths"]}
                  color={getColor('deaths')}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: getColor('deaths'),
                    }
                  }}
                />
                <ChartSeries
                  id="active"
                  name="Active"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={history}
                  xAccessor={"date"}
                  yAccessors={["active"]}
                  color={getColor('active')}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: getColor('active'),
                    }
                  }}
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
          <EuiFlexGroup className="chart main-chart" alignItems="center" justifyContent="center" gutterSize="none">
            <EuiFlexItem grow={false}>
              <EuiLoadingChart size="l" mono />
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
