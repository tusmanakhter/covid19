import React from 'react'
import PropTypes from 'prop-types'
import { EuiPage, EuiHeader, EuiHeaderSection, EuiHeaderSectionItem, EuiHeaderLinks, EuiHeaderLogo, EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer, EuiPopover } from '@elastic/eui';
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
          {
            EuiPopover && (
              <EuiHeaderLinks>
                <Link to="/" 
                  className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
                  activeStyle={{ color: "#006BB4" }}
                >
                  Global
                </Link>
                <Link to="/montreal/"
                  className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
                  activeStyle={{ color: "#006BB4" }}
                >
                  Montreal
                </Link>
                <Link to="/about/"
                  className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
                  activeStyle={{ color: "#006BB4" }}
                >
                  About
                </Link>
                <a href='https://ko-fi.com/P5P21KE6M' target='_blank' rel="noopener noreferrer"><img style={{border: 0, height: 36, margin: '2px 8px'}} src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' alt='Buy Me a Coffee at ko-fi.com' /></a>
              </EuiHeaderLinks>
            )
          }
        </EuiHeaderSection>
      </EuiHeader>
      <EuiPage className="page">
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem>
            {children}
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem grow={false}>
            <EuiText textAlign="center" className="footer">
              <p>Created by <a target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</a></p>
              <p>Support me on <a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/tusmanakhter">Ko-Fi</a></p>
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
