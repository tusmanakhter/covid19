import React from 'react'
import PropTypes from 'prop-types'
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiHorizontalRule, EuiLoadingContent, EuiText, EuiFlexGrid } from '@elastic/eui';
import moment from 'moment';

const Stat = ({ stats }) => {
  return (
    <>
      {
        ( stats ) ? (
        <EuiFlexGroup direction="column">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiTitle style={{textAlign: "center"}}><h2>Quebec</h2></EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiHorizontalRule margin="none" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <EuiTitle style={{textAlign: "center"}} size="xxs"><h5>* Per Capita on this page refers to per 100,000 people</h5></EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFlexGrid columns={3}>
                  <EuiFlexItem>
                    <EuiStat title={stats.cases.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="primary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.deaths.toLocaleString()} description="Deaths" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.recovered.toLocaleString()} description="Recovered" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.hospitalizations.toLocaleString()} description="Hospitalized" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.intensive.toLocaleString()} description="in Intensive Care" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.investigation.toLocaleString()} description="under Investigation" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.totalTests.toLocaleString()} description="Total Tests" titleSize="m" textAlign="center" titleColor="primary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.negative.toLocaleString()} description="Negative Tests" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={`${stats.percentCanada}%`} description="of Canada's cases" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                </EuiFlexGrid>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText textAlign="center">Last Update: {moment(stats.date).format('MMMM Do YYYY h:mm A')}</EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        ) : (
          <EuiLoadingContent lines={10} />
        )
      } 
    </>
  )
}

Stat.propTypes = {
  stats: PropTypes.object,
}

export default Stat
