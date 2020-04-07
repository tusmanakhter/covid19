import React, { useState } from 'react'
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
import '../global/chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const SplitChart = ({ data, title, barColor, lineColor, barAccessor, lineAccessor, barName, lineName }) => {
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
                  id={lineAccessor}
                  name={lineName}
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={[lineAccessor]}
                  color={lineColor}
                  curve={CurveType.LINEAR}
                  pointStyleAccessor={() => {
                    return {
                      fill: lineColor,
                    }
                  }}
                />
                <BarSeries
                  id={barAccessor}
                  name={barName}
                  xScaleType={ScaleType.Date}
                  yScaleType={scaleType}
                  data={data}
                  xAccessor={"date"}
                  yAccessors={[barAccessor]}
                  color={barColor}
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

SplitChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  barColor: PropTypes.string,
  lineColor: PropTypes.string,
  barAccessor: PropTypes.string,
  lineAccesor: PropTypes.string,
  barName: PropTypes.string,
  lineName: PropTypes.string,
}

export default SplitChart;
