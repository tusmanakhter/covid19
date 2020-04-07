import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ElasticChart,
  Settings,
  Axis,
  BarSeries,
  ScaleType,
} from '@elastic/charts';
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiHorizontalRule } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import '../global/chart.css';

const numberFormatter = (value) => value.toLocaleString();

const Chart = ({ data }) => {
  return (
    <>
      {
        data ? (
          <EuiFlexGroup direction="column">
            <EuiFlexItem grow={false}>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiTitle size="s"><h2>Cases By Age</h2></EuiTitle>
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
                <BarSeries
                  id={"confirmed"}
                  name={"Confirmed"}
                  xScaleType={ScaleType.Date}
                  yScaleType={ScaleType.Linear}
                  data={data}
                  xAccessor={"ageGroup"}
                  yAccessors={["cases"]}
                  color={"#006BB4"}
                />
                <BarSeries
                  id={"deaths"}
                  name={"Deaths"}
                  xScaleType={ScaleType.Date}
                  yScaleType={ScaleType.Linear}
                  data={data}
                  xAccessor={"ageGroup"}
                  yAccessors={["deaths"]}
                  color={"#BD271E"}
                />
                <Axis
                  id="bottom-axis"
                  position="bottom"
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
  data: PropTypes.array,
}

export default Chart;
