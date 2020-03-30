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
import { EuiLoadingChart, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import '@elastic/charts/dist/theme_light.css';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import './chart.css';

const dateFormatter = timeFormatter('MMM DD');
const numberFormatter = (value) => value.toLocaleString();

const Chart = ({ data }) => {
  return (
    <>
      {
        data ? (
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
              yScaleType={ScaleType.Linear}
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
              id="deaths"
              name="Deaths"
              xScaleType={ScaleType.Time}
              yScaleType={ScaleType.Linear}
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
