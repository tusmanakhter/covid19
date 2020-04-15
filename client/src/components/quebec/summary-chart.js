import React, { useState } from 'react'
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
import '../global/chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const SummaryChart = ({ data }) => {
  const [logScale, setLogScale] = useState(false);

  let scaleType;
  if (logScale) {
    scaleType = ScaleType.Log;
  } else {
    scaleType = ScaleType.Linear;
  }

  return (
    <>
      {
        data ? (
          <EuiFlexGroup direction="column">
            <EuiFlexItem grow={false}>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiTitle size="s"><h2>Summary</h2></EuiTitle>
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
                  name="Confirmed Cases"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={["confirmed"]}
                  color={"#006BB4"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#006BB4",
                    }
                  }}
                />
                <LineSeries
                  id="negative"
                  name="Negative Tests"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
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
                  id="deaths"
                  name="Deaths"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={["deaths"]}
                  color={"#BD271E"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#BD271E",
                    }
                  }}
                />
                <LineSeries
                  id="hospitalizations"
                  name="Hospitalizations"
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={["hospitalizations"]}
                  color={"#F5A700"}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: "#F5A700",
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

SummaryChart.propTypes = {
  data: PropTypes.object,
}

export default SummaryChart;
