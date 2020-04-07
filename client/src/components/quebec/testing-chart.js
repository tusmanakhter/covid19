import React from 'react'
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
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiHorizontalRule } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import '../global/chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const TestingChart = ({ data }) => {
  return (
    <>
      {
        data ? (
          <EuiFlexGroup direction="column">
            <EuiFlexItem grow={false}>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiTitle size="s"><h2>Testing</h2></EuiTitle>
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
                  id="negative"
                  name="Negative"
                  xScaleType={ScaleType.Date}
                  yScaleType={ScaleType.Linear}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={["negative"]}
                  color={"#017D73"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#017D73",
                    }
                  }}
                />
                <LineSeries
                  id="positive"
                  name="Positive"
                  xScaleType={ScaleType.Date}
                  yScaleType={ScaleType.Linear}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={["positive"]}
                  color={"#006BB4"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#006BB4",
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

TestingChart.propTypes = {
  data: PropTypes.array,
}

export default TestingChart;
