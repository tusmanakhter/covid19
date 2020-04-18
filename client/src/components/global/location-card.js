import React from 'react';
import PropTypes from 'prop-types'
import { EuiPanel, EuiText, EuiBadge, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

const LocationCard = ({ locationKey, location, stat, onRowClick, isPercentage, position, color, countryCode }) => (
    <EuiPanel onClick={() => {onRowClick(locationKey)}} style={{ backgroundColor: '#fbfcfd' }}>
      <EuiFlexGroup gutterSize="s" responsive={false} alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiText  size="s">
            <EuiBadge color={color} style={{ padding: '0 4px', minWidth: 32, textAlign: 'center' }}>{position}</EuiBadge>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <img src={`/flags/${countryCode.toLowerCase()}.svg`} alt={countryCode} height="18" width="24" />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <b>{location}</b>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText  size="s" textAlign="right">
            <b style={{ color: color }}>{stat.toLocaleString()}{isPercentage && '%'}</b>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
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
  countryCode: PropTypes.string,
};

LocationCard.defaultProps = {
  isPercentage: false,
};

export default LocationCard;
