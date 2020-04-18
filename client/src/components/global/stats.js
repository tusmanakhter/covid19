import React from 'react'
import PropTypes from 'prop-types'
import BackButton from './back-button';
import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiText, EuiSpacer, EuiBadge, EuiLoadingContent } from '@elastic/eui';
import StatLine from './stat-line';
import './stats.css';

const getIncrease = (stat, data, color) => {
  const increase = data.latest[`${stat}Increase`];
  const percentage = data.latest[`${stat}IncreasePercent`];

  return (
    <EuiText textAlign="center" size="xs">
      <EuiBadge color={color}>{increase > 0 && "+"}{increase.toLocaleString()} ({percentage}%)</EuiBadge>
    </EuiText>
  )
}

const getPercentTotal = (stat, data) => {
  const percentage = data.latest[`${stat}Rate`];

  return (
    <EuiText textAlign="center" size="xs">
      <b>Rate:</b> {percentage}%
    </EuiText>
  )
}

const Stats = ({ data, onBack }) => {
  return (
    <>
      {
        data ? (
          <div>
            <EuiFlexGroup responsive={false} gutterSize="s" alignItems="center" justifyContent="center">
              {
                data.location.country !== 'Global' && 
                <EuiFlexItem grow={false}>
                  <img src={`/flags/${data.location.iso2.toLowerCase()}.svg`} alt={data.location.iso2} height="18" width="24" />
                </EuiFlexItem>
              }
              <EuiFlexItem grow={false}>
              {
                data.location.province ? 
                  <EuiText><h2 style={{ fontSize: '1.6rem', fontWeight: 400 }}>{data.location.province}</h2></EuiText> :
                  <EuiText><h2 style={{ fontSize: '1.6rem', fontWeight: 400 }}>{data.location.country}</h2></EuiText>
              }
              </EuiFlexItem>
            </EuiFlexGroup>
            {
              data.location.province && <EuiText textAlign="center"><h4>{data.location.country}</h4></EuiText>
            }
            <EuiSpacer size="s"/>
            <StatLine 
                confirmed={data.latest.confirmed}
                recovered={data.latest.recovered}
                deaths={data.latest.deaths}
                active={data.latest.active}
            />
            <EuiSpacer size="m"/>
            <EuiStat title={data.latest.confirmed.toLocaleString()} description="Confirmed" titleSize="m" textAlign="center" titleColor="primary" />
            {getIncrease('confirmed', data, "#B2D2E8")}
            <EuiSpacer size="m"/>
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
            {
              !(data.location.country === 'Global') &&  (
                <>
                  <EuiSpacer size="m"/>
                  <BackButton data={data} onBack={onBack} />
                </>
              )
            }
          </div>
        ) : (
          <EuiLoadingContent lines={10} />
        )
      }
    </>
  )
}

Stats.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  onBack: PropTypes.func,
}

export default Stats
