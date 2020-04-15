import React from 'react';
import PropTypes from 'prop-types'
import { EuiPanel, EuiText, EuiBadge } from '@elastic/eui';

const LocationCard = ({ locationKey, location, stat, onRowClick, isPercentage, position, color }) => (
    <EuiPanel onClick={() => {onRowClick(locationKey)}}>
      <EuiText  size="s">
        <b>
          {/* <span style={{ width: 32 }}><EuiBadge color={color} style={{ padding: '0 4px' }}>{position}</EuiBadge></span>  */}
          {location}
        </b>
        <span style={{float: 'right'}}><b style={{ color: color }}>{stat.toLocaleString()}{isPercentage && '%'}</b></span>
      </EuiText>
    </EuiPanel>
);

LocationCard.propTypes = {
  locationKey: PropTypes.string,
  location: PropTypes.string,
  stat: PropTypes.number,
  onRowClick:  PropTypes.func,
  isPercentage:  PropTypes.bool,
  position: PropTypes.number,
  color: PropTypes.string,
};

LocationCard.defaultProps = {
  isPercentage: false,
};

export default LocationCard;
