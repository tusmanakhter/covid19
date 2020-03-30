import React from 'react'
import PropTypes from 'prop-types'
import { EuiPage, EuiHeader, EuiHeaderSection, EuiHeaderSectionItem } from '@elastic/eui';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <EuiHeader position="fixed">
        <EuiHeaderSection>
          <EuiHeaderSectionItem>
            <div className="header-logo">
              <img src="corona.svg" alt="Coronavirus" className="header-image" /><span className="header-logo-text">Covid-19 Tracker</span>
            </div>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      </EuiHeader>
      <EuiPage style={{padding: 8}}>
        {children}
      </EuiPage>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;
