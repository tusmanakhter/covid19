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
          <p>This website was created by <OutboundLink target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</OutboundLink>. Show your support on <OutboundLink target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/tusmanakhter">Ko-Fi</OutboundLink>.</p>
          <p>Contact <a target="_blank" rel="noopener noreferrer" href="mailto:dev@trackingcovid.info?Subject=Covid%20Tracker">dev@trackingcovid.info</a> for any suggestions, bugs or issues.</p>
          <h2>Sources</h2>
          <p>Global Data provided by <a target="_blank" rel="noopener noreferrer" href="https://systems.jhu.edu/">JHU CSSE</a> on <a target="_blank" rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19">Github</a></p>
          <p>Montreal data provided by <a target="_blank" rel="noopener noreferrer" href="https://santemontreal.qc.ca/en/public/coronavirus-covid-19/">Santé Montréal</a></p>
          <p>Icon provided by <a target="_blank" rel="noopener noreferrer" href="https://www.iconfinder.com/justicon">Just Icon</a> licensed under <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
        </EuiText>
      </EuiPanel>
    </Layout>
  )
}

export default About;
