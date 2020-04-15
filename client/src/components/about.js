import React from 'react'
import Layout from './layout'
import { EuiPanel, EuiText } from '@elastic/eui';
import { OutboundLink } from 'gatsby-plugin-gtag'
import './about.css';

const About = () => {
  return (
    <Layout>
      <EuiPanel className="panel">
        <EuiText textAlign="center">
          <h2>About</h2>
          <p>This website was created for learning purposes by <OutboundLink target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</OutboundLink>. Show your support on <OutboundLink target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/tusmanakhter">Ko-Fi</OutboundLink>.</p>
          <p>Contact <a target="_blank" rel="noopener noreferrer" href="mailto:dev@trackingcovid.info?Subject=Covid%20Tracker">dev@trackingcovid.info</a> for any suggestions, bugs or issues.</p>
          <h2>Sources</h2>
          <p>Global Data provided by <a target="_blank" rel="noopener noreferrer" href="https://systems.jhu.edu/">JHU CSSE</a> on <a target="_blank" rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19">Github</a></p>
          <p>Montreal data provided by <a target="_blank" rel="noopener noreferrer" href="https://santemontreal.qc.ca/en/public/coronavirus-covid-19/">Santé Montréal</a></p>
          <p>Quebec data provided by <a target="_blank" rel="noopener noreferrer" href="https://www.inspq.qc.ca/covid-19/donnees">The INSPQ</a></p>
          <p>Icon provided by <a target="_blank" rel="noopener noreferrer" href="https://www.iconfinder.com/justicon">Just Icon</a> licensed under <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
          <h2>Other Visualizations</h2>
          <p>World: <a target="_blank" rel="noopener noreferrer" href="https://coronavirus.jhu.edu/map.html">JHU</a>, <a target="_blank" rel="noopener noreferrer" href="https://bing.com/covid">Bing</a>, <a target="_blank" rel="noopener noreferrer" href="https://app.developer.here.com/coronavirus/">HERE</a></p>
          <p>Quebec: <a target="_blank" rel="noopener noreferrer" href="https://www.inspq.qc.ca/covid-19/donnees">INSPQ</a>, <a target="_blank" rel="noopener noreferrer" href="https://santequebec.ca/coronavirus-covid-19/statistiques">Santé Québec</a></p>
          <p>Montreal: <a target="_blank" rel="noopener noreferrer" href="https://santemontreal.qc.ca/en/public/coronavirus-covid-19/">Santé Montréal</a></p>
          <h2>Technologies Used</h2>
          <p><a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a> for the frontend</p>
          <p><a target="_blank" rel="noopener noreferrer" href="https://react-leaflet.js.org/">React-Leaflet</a> and <a target="_blank" rel="noopener noreferrer" href="https://leafletjs.com/">Leaflet.js</a> for the maps</p>
          <p><a target="_blank" rel="noopener noreferrer" href="https://elastic.github.io/eui/#/">Elastic UI</a> as the UI framework</p>
          <p><a target="_blank" rel="noopener noreferrer" href="https://elastic.github.io/elastic-charts/?path=/story/*">Elastic Charts</a> for the charts</p>
        </EuiText>
      </EuiPanel>
    </Layout>
  )
}

export default About;
