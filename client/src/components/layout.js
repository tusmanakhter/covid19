import React from 'react'
import PropTypes from 'prop-types'
import { EuiPage, EuiHeader, EuiHeaderSection, EuiHeaderSectionItem, EuiHeaderLinks, EuiHeaderLogo, EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer, EuiPopover } from '@elastic/eui';
import { Link } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-gtag'
import logoSvg from '../images/corona.svg';
import '../themes/theme_light.scss';
import './layout.css';

const Layout = ({ children, global }) => {
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
                <Link to="/quebec/"
                  className="euiButtonEmpty euiButtonEmpty--text euiHeaderLink"
                  activeStyle={{ color: "#006BB4" }}
                >
                  Quebec
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
              </EuiHeaderLinks>
            )
          }
        </EuiHeaderSection>
      </EuiHeader>
      {
        global ? (
          <>
            {children}
          </>
        ) : (
          <EuiPage className="page">
            <EuiFlexGroup direction="column" gutterSize="none">
              <EuiFlexItem>
                {children}
              </EuiFlexItem>
              <EuiSpacer size="s"/>
              <EuiFlexItem grow={false}>
                <EuiText textAlign="center" className="footer">
                  <p>Created by <OutboundLink target="_blank" rel="noopener noreferrer" href="https://www.tusmanakhter.com/">Tusman Akhter</OutboundLink></p>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPage>
        )
      }
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  global: PropTypes.bool,
}

Layout.defaulyProps = {
  global: false,
}

export default Layout;
