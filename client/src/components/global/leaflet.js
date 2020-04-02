import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Map, CircleMarker, Popup, TileLayer } from 'react-leaflet'
import { EuiText, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiLoadingChart, EuiPanel, EuiRadioGroup } from '@elastic/eui';
import Control from 'react-leaflet-control';
import './leaflet.css';

const stat = (title, stat, color) => (
  <EuiFlexGroup responsive={false} gutterSize="none">
    <EuiFlexItem style={{marginRight: 16}}>
      <EuiText><small><b>{title}: </b></small></EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiText className="map-popup" color={color}><small><b>{stat.toLocaleString()}</b></small></EuiText>
    </EuiFlexItem>
  </EuiFlexGroup>
)

const getColor = (type) => {
  switch (type.toLowerCase()) {
    case 'confirmed':
      return '#006BB4';
    case 'recovered':
      return '#017D73';
    case 'deaths':
      return '#BD271E';
    default:
      return '#1a1c21';
  }
}

const radios = [
  {
    id: 'confirmed',
    label: 'Confirmed',
  },
  {
    id: 'recovered',
    label: 'Recovered',
  },
  {
    id: 'deaths',
    label: 'Deaths',
  },
];

const Leaflet = ({ data, selectedData }) => {
  const [zoom, setZoom] = useState(2);
  const [position, setPosition] = useState([35,6]);
  const [markerType, setMarkerType] = useState('confirmed');
  
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
    markers = data.map(location => {
      const key = `${location.location.country}${location.location.province}`
      const coordinates = {lat: location.location.lat, lng: location.location.long};
      const radius = Math.log10(location.latest[markerType])*3;
      const color = getColor(markerType);

      return (
        <CircleMarker key={key} center={coordinates} radius={radius} stroke={false} color={color} fillOpacity={0.5}>
          <Popup autoClose>
            {location.location.province ? 
              <>
              <EuiText>
                <dl>
                  <dt>{location.location.province}</dt>
                  <dd style={{fontSize: "0.9rem"}}>{location.location.country}</dd>
                </dl>
              </EuiText>
              </> :
              <EuiText><dl><dt>{location.location.country}</dt></dl></EuiText>
            }
            <EuiHorizontalRule margin="xs" />
            {stat('Confirmed', location.latest.confirmed, 'default')}
            {stat('Recovered', location.latest.recovered, 'secondary')}
            {stat('Deaths', location.latest.deaths, 'danger')}
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
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Control position="bottomleft" >
              <EuiPanel>
                <EuiRadioGroup
                  options={radios}
                  idSelected={markerType}
                  onChange={(option) => setMarkerType(option)}
                  name="Marker type"
                  legend={{
                    children: <span>Marker Scale</span>,
                  }}
                />
              </EuiPanel>
            </Control>
            {markers}
          </Map>
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

Leaflet.propTypes = {
  data: PropTypes.array,
  selectedData: PropTypes.object,
}

export default Leaflet;
