import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ElasticChart,
  Settings,
  Axis,
  BarSeries,
  ScaleType,
  CurveType,
  timeFormatter
} from '@elastic/charts';
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup, EuiPanel, EuiTitle, EuiHorizontalRule } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import './chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();



const Chart = ({ title, data }) => {
  const [daily, setDaily] = useState();

  useEffect(() => {
    if (data) {
      const dataHistory = [...data.history];
      const date = (new Date()).setUTCHours(0,0,0,0);
      const latest = {
        date,
        confirmed: data.latest.confirmed,
        recovered: data.latest.recovered,
        deaths: data.latest.deaths,
        active: data.latest.active,
      }
      dataHistory.push(latest);

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

        const active = item.confirmed - (item.recovered + item.deaths);
        const previousActive = previousValue.confirmed - (previousValue.recovered + previousValue.deaths);

        return {
          date: item.date,
          confirmed: item.confirmed - previousValue.confirmed,
          recovered: item.recovered - previousValue.recovered,
          deaths: item.deaths - previousValue.deaths,
          active: item.active - previousValue.active,
        }
      });
      setDaily(dailyHistory);
    }
  }, [data]);

  const getChart = (type, color) => {
    const typeLower = type.toLowerCase();
  
    return (
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem>
              <EuiTitle size="s"><h2>Daily {type} - {title}</h2></EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiHorizontalRule margin="none" />
        <EuiFlexItem>
          <ElasticChart className="chart daily-chart">
            <Settings
              theme={[EUI_CHARTS_THEME_LIGHT.theme]}
              showLegend={true}
              legendPosition="bottom"
              showLegendDisplayValue={false}
            />
            <BarSeries
              id={typeLower}
              name={type}
              xScaleType={ScaleType.Time}
              yScaleType={ScaleType.Linear}
              data={daily}
              xAccessor={"date"}
              yAccessors={[typeLower]}
              color={color}
              curve={CurveType.LINEAR}
              pointStyleAccessor={() => {
                return {
                  fill: color,
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
    )
  }

  return (
    <>
      {
        daily ? (
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s">
                <EuiFlexItem>
                  <EuiPanel>
                    {getChart('Confirmed', '#006BB4')}
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiPanel>
                    {getChart('Recovered', '#017D73')}
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s">
                <EuiFlexItem>
                  <EuiPanel>
                    {getChart('Deaths', '#BD271E')}
                  </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiPanel>
                    {getChart('Active', '#F5A700')}
                  </EuiPanel>
                </EuiFlexItem>
              </EuiFlexGroup>
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
