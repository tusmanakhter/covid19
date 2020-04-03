import React from 'react'
import Layout from './layout'
import { EuiPanel, EuiText } from '@elastic/eui';
import { Link } from 'gatsby';

const Error404 = () => {
  return (
    <Layout>
      <EuiPanel className="panel">
        <EuiText textAlign="center">
          <h2>Whoops, this page does not exist...</h2>
          <Link to="/"
            className="euiButtonEmpty euiButtonEmpty--primary euiHeaderLink"
          >
            Go to Global page
          </Link>
        </EuiText>
      </EuiPanel>
    </Layout>
  )
}

export default Error404;
