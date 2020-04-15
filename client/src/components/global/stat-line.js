import React from 'react'
import PropTypes from 'prop-types'

const getWidth = (total, slice) => {
  return ((slice/total)*100);
}

const StatLine = ({ confirmed, active, recovered, deaths }) => (
  <div style={{ display: 'flex' }}>
    { active > 0 && <div style={{ background: '#F5A700', height: 5, borderRadius: 6, width: `${getWidth(confirmed, active)}%`, marginRight: 4 }}></div> }
    { recovered > 0 && <div style={{ background: '#017D73', height: 5, borderRadius: 6, width: `${getWidth(confirmed, recovered)}%`, marginRight: 4 }}></div> }
    { deaths > 0 && <div style={{ background: '#BD271E', height: 5, borderRadius: 6, width: `${getWidth(confirmed, deaths)}%`}}></div> }
  </div>
)

StatLine.propTypes = {
  confirmed: PropTypes.number,
  active: PropTypes.number,
  recovered: PropTypes.number,
  deaths: PropTypes.number,
}

export default StatLine;
