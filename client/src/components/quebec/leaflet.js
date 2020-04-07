import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import Control from 'react-leaflet-control';
import { EuiText, EuiFlexGroup, EuiFlexItem, EuiTextColor, EuiLoadingChart, EuiPanel, EuiRadioGroup } from '@elastic/eui';
import { useMediaQuery } from 'react-responsive'
import quebecGeoJson from '../../geojson/quebec.json';
import { getRegionKey as getKey } from '../../helpers/key';
import '../global/leaflet.css';

const stat = (title, stat) => (
  <EuiFlexGroup responsive={false} gutterSize="none">
    <EuiFlexItem style={{marginRight: 16}}>
      <EuiText size="s">{title}: </EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiText size="s">{stat.toLocaleString()}</EuiText>
    </EuiFlexItem>
  </EuiFlexGroup>
)

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

const radios = [
  {
    id: 'cases',
    label: 'Confirmed',
  },
  {
    id: 'perHundred',
    label: 'Per Capita',
  },
];

const Leaflet = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const [choroplethGradeType, setChoroplethGradeType] = useState('cases');
  const geoJson = useRef();
  const leafletMap = useRef();

  const getStyle = useCallback(
    (feature) => {
      const key = getKey(feature.properties.res_nm_reg);

      const amount = data[key][choroplethGradeType];
      
      return {
        fillColor: getColor(amount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    },
    [data, choroplethGradeType],
  );

  const getDisclaimer = (region) => {
    if (region === 'Mauricie*' || region === 'Centre-du-Québec*') {
      return '*Mauricie and Centre-du-Quebec are combined';
    }
    return null
  }

  const highlightFeature = (e) => {
    const layer = e.target;
    let region = layer.feature.properties.res_nm_reg;
    const key =  getKey(region);
    const cases = data[key].cases;
    const perHundred = data[key].perHundred;
    if (e.containerPoint) {
      if (region === 'Mauricie' || region === 'Centre-du-Québec') {
        region = `${region}*`
      }
      setHovered({region, cases, perHundred });
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
    const key =  getKey(feature.properties.res_nm_reg);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    layer.key = key;
  }

  const isSmall = useMediaQuery({ query: '(max-width: 767px)' })

  let zoom;
  if (isSmall) {
    zoom = 3
  } else {
    zoom = 4
  }

  return (
    <>
      {
        data ? (
          <Map ref={leafletMap} center={[54.55, -69.55]} zoom={zoom} >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON
              ref={geoJson}
              data={quebecGeoJson}
              style={getStyle}
              onEachFeature={onEachFeature}
            />
            <Control position="topright" >
              <EuiPanel>
                <EuiText className="info" size="s">
                    <p><b><EuiTextColor color="subdued">Quebec Confirmed COVID-19 Cases</EuiTextColor></b></p>
                    {
                      hovered ? (
                        <>
                          <p><b>{hovered.region}</b></p>
                          {stat('Confirmed', hovered.cases)}
                          {stat('Per Capita', hovered.perHundred)}
                          {getDisclaimer(hovered.region)}
                        </>
                      ) : (
                        <p>Hover over a region</p>
                      )
                    }
                </EuiText>
              </EuiPanel>
            </Control>
            <Control position="bottomright" className="legend" >
              <EuiPanel>
                {getBottomPanel()}
              </EuiPanel>
            </Control>
            <Control position="bottomleft" >
              <EuiPanel>
                <EuiRadioGroup
                  options={radios}
                  idSelected={choroplethGradeType}
                  onChange={(option) => setChoroplethGradeType(option)}
                  name="Show"
                  legend={{
                    children: <span>Show</span>,
                  }}
                />
              </EuiPanel>
            </Control>
          </Map>        
        ) : (
          <EuiFlexGroup className="chart" alignItems="center" justifyContent="center">
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
}

export default Leaflet;
