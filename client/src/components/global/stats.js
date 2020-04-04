import React from 'react'
import PropTypes from 'prop-types'
import BackButton from './back-button';
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiText, EuiIcon, EuiHorizontalRule, EuiLoadingContent } from '@elastic/eui';

const getIncrease = (stat, data) => {
  const latest = data.latest[stat];
  const previous = data.history.slice(-1).pop()[stat];
  let increase = latest - previous;
  let percentage = ((increase/previous)*100).toFixed(2);

  if (!isFinite(increase)) {
    increase = '---'
  }

  if (!isFinite(percentage)) {
    percentage = '-.--'
  }

  return (
    <EuiText textAlign="center" size="xs">
      (<EuiIcon type="sortUp" />{increase.toLocaleString()} / {percentage}%)
    </EuiText>
  )
}

const getPercentTotal = (stat, data) => {
  const latest = data.latest[stat];
  const confirmed = data.latest.confirmed;
  let label;
  if (stat === 'recovered') {
    label = 'Recovery Rate:';
  } else if (stat === 'deaths') {
    label = 'Death Rate:'
  }
  let percentage = ((latest/confirmed)*100).toFixed(2);

  if (!isFinite(percentage)) {
    percentage = '-.--'
  }

  return (
    <EuiText textAlign="center" size="xs">
      <b>{label}</b> {percentage}%
    </EuiText>
  )
}

const getActiveCases = (data) => {
  const label = 'Active Cases:';
  const active = data.latest.active;

  return (
    <EuiText textAlign="center" size="xs">
      <b>{label}</b> {active.toLocaleString()}
    </EuiText>
  )
}

const Stats = ({ title, data, onBack }) => {
  return (
    <>
      {
        data ? (
        <EuiFlexGroup direction="column">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiTitle style={{textAlign: "center"}}><h2>{title}</h2></EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiHorizontalRule margin="none" />
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiStat title={data.latest.confirmed.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="primary" />
                {getIncrease('confirmed', data)}
                {getActiveCases(data)}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat title={data.latest.recovered.toLocaleString()} description="Recovered" titleSize="m" textAlign="center" titleColor="secondary" />
                {getIncrease('recovered', data)}
                {getPercentTotal('recovered', data)}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat title={data.latest.deaths.toLocaleString()} description="Deaths" titleSize="m"  textAlign="center" titleColor="danger" />
                {getIncrease('deaths', data)}
                {getPercentTotal('deaths', data)}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          {
            !(data.location.country === 'Global') &&  (
              <EuiFlexItem>
                <BackButton data={data} onBack={onBack} />
              </EuiFlexItem>
            )
          }
        </EuiFlexGroup>
        ) : (
          <EuiLoadingContent lines={10} />
        )
      } 
    </>
  )
}

Stats.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  data: PropTypes.object,
  onBack: PropTypes.func,
}

export default Stats
