import React from 'react'
import PropTypes from 'prop-types'
import BackButton from './back-button';
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiTitle, EuiText, EuiHorizontalRule, EuiLoadingContent, EuiBadge } from '@elastic/eui';
import StatLine from './stat-line';
import './stats.css';

const getIncrease = (stat, data, color) => {
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
      <EuiBadge color={color}>{increase > 0 && "+"}{increase.toLocaleString()} ({percentage}%)</EuiBadge>
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
  } else if (stat === 'active') {
    label = "Active Percent:"
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
          <StatLine 
              confirmed={data.latest.confirmed}
              recovered={data.latest.recovered}
              deaths={data.latest.deaths}
              active={data.latest.active}
          />
          <EuiFlexItem>
            <EuiStat title={data.latest.confirmed.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="primary" />
            {getIncrease('confirmed', data, "#B2D2E8")}
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiStat className="active" title={data.latest.active.toLocaleString()} description="Active" titleSize="s" textAlign="center" titleColor="accent" />
                {getIncrease('active', data, "#FCE4B2")}
                {getPercentTotal('active', data)}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat title={data.latest.recovered.toLocaleString()} description="Recovered" titleSize="s" textAlign="center" titleColor="secondary" />
                {getIncrease('recovered', data, "#B2D8D5")}
                {getPercentTotal('recovered', data)}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiStat title={data.latest.deaths.toLocaleString()} description="Deaths" titleSize="s"  textAlign="center" titleColor="danger" />
                {getIncrease('deaths', data, "#EBBEBB")}
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
