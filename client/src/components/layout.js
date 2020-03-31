import React from 'react'
import PropTypes from 'prop-types'
import { EuiPage, EuiHeader, EuiHeaderSection, EuiHeaderSectionItem, EuiHeaderLinks, EuiHeaderLogo, EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer } from '@elastic/eui';
import { Link } from 'gatsby'
import logoSvg from '../images/corona.svg';
import '../themes/theme_light.scss';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <EuiHeader position="fixed" className="header">
        <EuiHeaderSection>
          <EuiHeaderSectionItem border="right">
            <EuiHeaderLogo iconType={logoSvg}>Covid-19 Tracker</EuiHeaderLogo>
          </EuiHeaderSectionItem>
          <EuiHeaderLinks>
            <Link to="/"
              className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
              activeStyle={{ color: "#006BB4" }}
            >
              Montreal
            </Link>
            <Link to="/global" 
              className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
              activeStyle={{ color: "#006BB4" }}
            >
              Global
            </Link>
          </EuiHeaderLinks>
        </EuiHeaderSection>
      </EuiHeader>
      <EuiPage style={{padding: 8}}>
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem>
            {children}
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiText textAlign="center" className="footer">
              <p>Data provided by <a target="_blank" rel="noopener noreferrer" href="https://systems.jhu.edu/">JHU CSSE</a> on <a target="_blank" rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19">Github</a></p>
              <p>Montreal data provided by <a target="_blank" rel="noopener noreferrer" href="https://santemontreal.qc.ca/en/public/coronavirus-covid-19/">Santé Montréal</a></p>
              <p>Icon provided by <a target="_blank" rel="noopener noreferrer" href="https://www.iconfinder.com/justicon">Just Icon</a> licensed under <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
              <p>Code available on <a target="_blank" rel="noopener noreferrer" href="https://github.com/tusmanakhter/covid19">Github</a> written by <a target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</a></p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPage>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;
