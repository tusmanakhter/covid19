const types = {
  'name': {
    color: '#006BB4',
    label: 'Name',
  },
  'confirmed': {
    color: '#006BB4',
    label: 'Confirmed',
  },
  'recovered': {
    color: '#017D73',
    label: 'Recovered',
  },
  'deaths': {
    color: '#BD271E',
    label: 'Deaths',
  },
  'active': {
    color: '#F5A700',
    label: 'Active',
  },
  'recoveredRate': {
    color: '#004B45',
    label: 'Recovery Rate',

  },
  'deathsRate': {
    color: '#711712',
    label: 'Death Rate',
  },
  'activeRate': {
    color: '#936400',
    label: 'Active Rate',
  },
  'perCapita': {
    color: '#DD0A73',
    label: 'Per 100,000',
  },
  'confirmedIncrease': {
    color: '#6092C0',
    label: 'Confirmed Increase',
  },
  'recoveredIncrease': {
    color: '#54B399',
    label: 'Recovered Increase',
  },
  'deathsIncrease': {
    color: '#E7664C',
    label: 'Deaths Increase',
  },
  'activeIncrease': {
    color: '#D6BF57',
    label: 'Active Increase',
  },
  'confirmedIncreasePercent': {
    color: '#6092C0',
    label: 'Confirmed Increase (%)',
  },
  'recoveredIncreasePercent': {
    color: '#54B399',
    label: 'Recovered Increase (%)',
  },
  'deathsIncreasePercent': {
    color: '#E7664C',
    label: 'Deaths Increase (%)',
  },
  'activeIncreasePercent': {
    color: '#D6BF57',
    label: 'Active Increase (%)',
  },
}

const getTypesOptions = (inputDisplay) => {
  const options = Object.entries(types).map(([key, value]) => (
    {
      value: key,
      inputDisplay: inputDisplay(key, value.label),
    }
  ));
  return options;
}

const getColor = (key) => {
  if (types[key]) {
    return types[key].color;
  }
  return '#1a1c21';
}

const getLabel = (key) => {
  if (types[key]) {
    return types[key].label;
  }
  return '';
}

const isPercent = (key) => {
  return key.includes('Rate') || key.includes('Percent');
}

export { getColor, getLabel, getTypesOptions, isPercent };
