import React from 'react'
import PropTypes from 'prop-types'
import SplitChart from './split-chart';

const ConfirmedChart = ({ data }) => (
  <SplitChart
    data={data}
    title="Confirmed cases"
    barColor="#66A6D2"
    lineColor="#006BB4"
    barAccessor="daily"
    lineAccessor="confirmed"
    barName="Daily Confirmed"
    lineName="Confirmed"
  />
)

ConfirmedChart.propTypes = {
  data: PropTypes.array,
}

export default ConfirmedChart;
