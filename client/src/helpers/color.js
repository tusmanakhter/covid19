const getColor = (type) => {
  switch (type) {
    case 'confirmed':
      return '#006BB4';
    case 'recovered':
      return '#017D73';
    case 'deaths':
      return '#BD271E';
    case 'active':
      return '#F5A700';
    case 'confirmedIncrease':
      return '#6092C0';
    case 'recoveredIncrease':
      return '#54B399';
    case 'deathsIncrease':
      return '#E7664C';
    case 'activeIncrease':
      return '#D6BF57';
    case 'confirmedIncreasePercent':
      return '#6092C0';
    case 'recoveredIncreasePercent':
      return '#54B399';
    case 'deathsIncreasePercent':
      return '#E7664C';
    case 'activeIncreasePercent':
      return '#D6BF57';
    case 'recoveredRate':
      return '#004B45';
    case 'deathsRate':
      return '#711712';
    case 'activeRate':
      return '#936400';
    case 'perCapita':
      return '#DD0A73';
    case 'name':
      return '#006BB4';
    default:
      return '#1a1c21';
  }
}

export { getColor };
