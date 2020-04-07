import React from 'react'
import PropTypes from 'prop-types'
import SplitChart from './split-chart';

const HospitalizationsChart = ({ data }) => (
  <SplitChart
    data={data}
    title="Hospitalizations"
    barColor="#f9ca66"
    lineColor="#F5A700"
    barAccessor="intensive"
    lineAccessor="hospitalizations"
    barName="Intensive Care"
    lineName="Hospitalizations"
  />
)

HospitalizationsChart.propTypes = {
  data: PropTypes.array,
}

export default HospitalizationsChart;
