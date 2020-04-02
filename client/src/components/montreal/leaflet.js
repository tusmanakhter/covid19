import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import Control from 'react-leaflet-control';
import { EuiText, EuiFlexGroup, EuiFlexItem, EuiTextColor, EuiLoadingChart, EuiPanel } from '@elastic/eui';
import { useMediaQuery } from 'react-responsive'
import ky from 'ky';
import getKey from '../../helpers/key';
import '../global/leaflet.css';
import './leaflet.css';

const getColor = (d) => {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

const getBottomPanel = () => {
  const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  const gradesMap = grades.map((value, i) => {
    return (
      <p key={value}>
        <i style={{background: getColor(value + 1)}}></i>
        {value}{grades[i + 1] ? <>&ndash;{grades[i + 1]}</> : <>+</>}
      </p>
    )
  })
  return gradesMap;
}

const Leaflet = ({ data, mouseEnter, mouseLeave }) => {
  const [geoJSON, setGeoJson] = useState();
  const [hovered, setHovered] = useState(null);
  const geoJson = useRef();
  const leafletMap = useRef();

  useEffect(() => {
    (async () => {
      const data = await ky.get('https://api.trackingcovid.info/api/montreal/geojson').json();
      setGeoJson(data);
    })();
  }, []);

  const getStyle = useCallback(
    (feature) => {
      const key = getKey(feature.properties.district);
      const amount = data[key];
  
      return {
        fillColor: getColor(amount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    },
    [data],
  );

  const highlightFeature = (e) => {
    const layer = e.target;
    const location = layer.feature.properties.district;
    const key =  getKey(location);
    const confirmed = data[key];
    if (e.containerPoint) {
      setHovered({location, confirmed});
    }

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
  
    layer.bringToFront();
  }
  
  const resetHighlight = (e) => {
    setHovered(null);
    geoJson.current.leafletElement.resetStyle(e.target);
  }
  
  const zoomToFeature = (e) => {
    if (isSmall) {
      highlightFeature(e);
    }
    leafletMap.current.leafletElement.fitBounds(e.target.getBounds());
  }
  
  const onEachFeature = (feature, layer) => {
    const key =  getKey(feature.properties.district);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    layer._leaflet_id = key;
  }

  useEffect(() => {
    if (mouseEnter && mouseEnter !== "territorytobeconfirmed") {
      const layer = geoJson.current.leafletElement.getLayer(mouseEnter);
      layer.fireEvent('mouseover');
    }
    if (mouseLeave && mouseLeave !== "territorytobeconfirmed") {
      const layer = geoJson.current.leafletElement.getLayer(mouseLeave);
      layer.fireEvent('mouseout');
    }
  }, [mouseEnter, mouseLeave]);

  const isSmall = useMediaQuery({ query: '(max-width: 767px)' })

  let zoom;
  if (isSmall) {
    zoom = 10
  } else {
    zoom = 11
  }

  return (
    <>
      {
        data ? (
          <Map ref={leafletMap} center={[45.55, -73.72]} zoom={zoom} className="montreal">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {(geoJSON) && 
              <GeoJSON
                ref={geoJson}
                data={geoJSON} 
                style={getStyle}
                onEachFeature={onEachFeature}
              />
            }
            <Control position="topright" >
              <EuiPanel>
                <EuiText className="info">
                  <small>
                    <p><b><EuiTextColor color="subdued">Montreal Confirmed COVID-19 Cases</EuiTextColor></b></p>
                    {
                      hovered ? (
                        <>
                          <p><b>{hovered.location}</b></p>
                          <p>{hovered.confirmed.toLocaleString()} people</p>
                        </>
                      ) : (
                        <p>Hover over a borrough/linked city</p>
                      )
                    }
                  </small>
                </EuiText>
              </EuiPanel>
            </Control>
            <Control position="bottomright" className="legend" >
              <EuiPanel>
                {getBottomPanel()}
              </EuiPanel>
            </Control>
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
  data: PropTypes.object,
  mouseEnter: PropTypes.string,
  mouseLeave: PropTypes.string,
}

export default Leaflet;
