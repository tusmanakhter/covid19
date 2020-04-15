import React from 'react'
import PropTypes from 'prop-types'
import SplitChart from './split-chart';

const DeathsChart = ({ data }) => (
  <SplitChart
    data={data}
    title="Deaths"
    barColor="#D77D78"
    lineColor="#BD271E"
    barAccessor="dailyDeaths"
    lineAccessor="deaths"
    barName="Daily Deaths"
    lineName="Deaths"
  />
)

DeathsChart.propTypes = {
  data: PropTypes.array,
}

export default DeathsChart;
