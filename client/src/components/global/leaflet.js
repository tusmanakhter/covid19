import React, { useState, useCallback, useEffect } from 'react'
import { withPrefix } from "gatsby"
import PropTypes from 'prop-types'
import { Map, CircleMarker, Popup, TileLayer } from 'react-leaflet'
import { EuiText, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiLoadingChart } from '@elastic/eui';
import { getColor, getLabel, isPercent } from '../../helpers/types';
import './leaflet.css';

const stat = (title, stat, type, isPercentage = false) => (
  <EuiFlexGroup responsive={false} gutterSize="none">
    <EuiFlexItem style={{marginRight: 16}}>
      <EuiText size="xs"><b>{title}: </b></EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiText className="map-popup" size="xs"><b style={{color: getColor(type)}}>{stat.toLocaleString()}{isPercentage && '%'}</b></EuiText>
    </EuiFlexItem>
  </EuiFlexGroup>
)

const onMouseOver = (e) => {
  e.target.openPopup();
}

const onMouseOut = (e) => {
  e.target.closePopup();
}

const Leaflet = ({ data, selectedData, markerType }) => {
  const [zoom, setZoom] = useState(2);
  const [position, setPosition] = useState([25, 10]);
  
  useEffect(() => {
    if (selectedData) {
      const position = [selectedData.location.lat, selectedData.location.long];
      setPosition(position);
  
      if (selectedData.location.country === 'Global') {
        setZoom(2);
      } else if (selectedData.location.province === '') {
        setZoom(4);
      } else {
        setZoom(5);
      }
    }
  }, [selectedData]);


  const onViewportChanged = useCallback((viewport) => {
    setZoom(viewport.zoom)
  }, []);

  let markers = null;

  if (data) {
    const color = getColor(markerType);
    const label = getLabel(markerType);
    const isPercentage = isPercent(markerType);

    const defaultDisplayStats = ['name', 'confirmed', 'active', 'recovered', 'deaths'];
    const isDefaultStat = defaultDisplayStats.includes(markerType);

    markers = data.map(location => {
      const key = `${location.location.country}${location.location.province}`
      const coordinates = {lat: location.location.lat, lng: location.location.long};
      let value = location.latest[markerType];
      let radius;
      if (isPercentage) {
        if (value > 200) {
          value = 200;
        }
        radius = (value >= 0 && !isNaN(value)) ? (value/10) : 0;
      } else {
        radius = (value >= 0 && !isNaN(value)) ? Math.log10(value)*3 : 0;
      }

      return (
        <CircleMarker 
          key={key} 
          center={coordinates} 
          radius={radius} 
          stroke={false} 
          color={color} 
          fillOpacity={0.5}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onFocus={onMouseOver}
          onBlur={onMouseOut}
        >
          <Popup autoClose>
            <EuiFlexGroup responsive={false} gutterSize="m" alignItems="center">
              <EuiFlexItem>
              {
                location.location.province ? 
                <>
                <EuiText size="s">
                  <dl>
                    <dt>{location.location.province}</dt>
                    <dd style={{fontSize: "0.9rem"}}>{location.location.country}</dd>
                  </dl>
                </EuiText>
                </> :
                <EuiText size="s"><dl><dt>{location.location.country}</dt></dl></EuiText>
              }
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <img src={withPrefix(`/flags/${location.location.iso2.toLowerCase()}.svg`)} alt={location.location.iso2} height="18" width="24" />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule margin="xs" />
            {stat('Confirmed', location.latest.confirmed, 'confirmed')}
            {stat('Active', location.latest.active, 'active')}
            {stat('Recovered', location.latest.recovered, 'recovered')}
            {stat('Deaths', location.latest.deaths, 'deaths')}
            {!isDefaultStat && stat(label, location.latest[markerType], markerType, isPercentage)}
          </Popup>
        </CircleMarker>
      )
    })
  }

  return (
    <>
      {
        markers ? (
          <Map 
            center={position} 
            zoom={zoom} 
            minZoom={1} 
            onViewportChanged={onViewportChanged}
            useFlyTo={true}
            className="main-leaflet"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {markers}
          </Map>
        ) : (
          <EuiFlexGroup className="chart" alignItems="center" justifyContent="center">
            <EuiFlexItem grow={false}>
              <EuiLoadingChart size="l" mono />
            </EuiFlexItem>
          </EuiFlexGroup>
        )
      }
    </>
  )
}

Leaflet.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.object,
  markerType: PropTypes.string,
}

export default Leaflet;
