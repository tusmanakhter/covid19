import React from 'react'
import PropTypes from 'prop-types'
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiHorizontalRule, EuiLoadingContent, EuiText } from '@elastic/eui';
import moment from 'moment';

const Stat = ({ confirmed, perHundred, lastUpdate }) => {
  return (
    <>
      {
        (confirmed && lastUpdate) ? (
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
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiStat title={confirmed.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="primary" />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiStat title={perHundred.toLocaleString()} description="Confirmed/100k" titleSize="m" textAlign="center" titleColor="primary" />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText textAlign="center">Last Update: {moment(lastUpdate).format('MMMM Do YYYY h:mm A')}</EuiText>
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
  confirmed: PropTypes.number,
  perHundred: PropTypes.number,
  lastUpdate: PropTypes.number,
}

export default Stat
