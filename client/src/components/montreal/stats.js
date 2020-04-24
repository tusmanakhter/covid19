import React from 'react'
import PropTypes from 'prop-types'
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiHorizontalRule, EuiLoadingContent, EuiText } from '@elastic/eui';
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
                <EuiTitle style={{textAlign: "center"}}><h2>Montreal</h2></EuiTitle>
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
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiStat title={stats.confirmed.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.perHundred.toLocaleString()} description="Confirmed Per Capita" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={`${((stats.confirmed/stats.quebecCases)*100).toFixed(2)}%`} description="of Quebec's cases" titleSize="m" textAlign="center" titleColor="primary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={`${((stats.confirmed/stats.canadaCases)*100).toFixed(2)}%`} description="of Canada's cases" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiStat title={stats.deaths.toLocaleString()} description="Deaths" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={stats.perHundredDeaths.toLocaleString()} description="Deaths Per Capita" titleSize="m" textAlign="center" titleColor="secondary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={`${((stats.deaths/stats.quebecDeaths)*100).toFixed(2)}%`} description="of Quebec's deaths" titleSize="m" textAlign="center" titleColor="primary" reverse />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={`${((stats.deaths/stats.canadaDeaths)*100).toFixed(2)}%`} description="of Canada's deaths" titleSize="m" textAlign="center" titleColor="danger" reverse />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText textAlign="center">Last Update: {moment(stats.lastUpdate).format('MMMM Do YYYY h:mm A')}</EuiText>
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
