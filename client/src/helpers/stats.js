const getIncrease = (stat, data, dateIndex, getPercent = false) => {
  const latest = data.latest[stat];
  const previousDate = data.history[dateIndex-1];

  let previous;
  if (previousDate === undefined) {
    previous = 0;
  } else {
    previous = data.history[dateIndex-1][stat];
  }
  let increase = latest - previous;

  if (getPercent) {
    let percentage = ((increase/previous)*100).toFixed(2);
    if (!isFinite(percentage)) {
      percentage = (0).toFixed(2);
    }
    return parseFloat(percentage);
  } else {
    if (!isFinite(increase)) {
      increase = 0;
    }
    return parseInt(increase);
  }
}

const getPercentTotal = (stat, data) => {
  const latest = data.latest[stat];
  const confirmed = data.latest.confirmed;
  let percentage = ((latest/confirmed)*100).toFixed(2);

  if (!isFinite(percentage)) {
    percentage = (0).toFixed(2);
  }

  return parseFloat(percentage);
}


const getGlobalPercent = (stat, data, global) => {
  const latest = data.latest[stat];
  const globalLatest = global.latest[stat];
  let percentage = ((latest/globalLatest)*100).toFixed(2);

  if (!isFinite(percentage)) {
    percentage = (0).toFixed(2);
  }

  return parseFloat(percentage);
}

const addLatestStats = (location, global, dateIndex) => {
  const confirmedIncrease = getIncrease('confirmed', location, dateIndex);
  const recoveredIncrease =  getIncrease('recovered', location, dateIndex);
  const deathsIncrease =  getIncrease('deaths', location, dateIndex);
  const activeIncrease =  getIncrease('active', location, dateIndex);
  const confirmedIncreasePercent = getIncrease('confirmed', location, dateIndex, true);
  const recoveredIncreasePercent = getIncrease('recovered', location, dateIndex, true);
  const deathsIncreasePercent = getIncrease('deaths', location, dateIndex, true); 
  const activeIncreasePercent = getIncrease('active', location, dateIndex, true);
  const recoveredRate = getPercentTotal('recovered', location);
  const deathsRate = getPercentTotal('deaths', location);
  const activeRate = getPercentTotal('active', location);
  const confirmedGlobalPercent = getGlobalPercent('confirmed', location, global);
  const recoveredGlobalPercent =  getGlobalPercent('recovered', location, global);
  const deathsGlobalPercent =  getGlobalPercent('deaths', location, global);
  const activeGlobalPercent =  getGlobalPercent('active', location, global);
  
  const latest = {
    perCapita: 0,
    ...location.latest,
    confirmedIncrease,
    recoveredIncrease,
    deathsIncrease,
    activeIncrease,
    confirmedIncreasePercent,
    recoveredIncreasePercent,
    deathsIncreasePercent,
    activeIncreasePercent,
    recoveredRate,
    deathsRate,
    activeRate,
    confirmedGlobalPercent,
    recoveredGlobalPercent,
    deathsGlobalPercent,
    activeGlobalPercent,
  }

  return latest;
}

const getCountryData = (data) => {
  const locationsArray = Object.entries(data.locations);
  const countryData = locationsArray.map(([key, value]) => {
    return {
      key,
      ...value
    }
  })
  .filter(location => location.location && location.location.province === '');
  return countryData;
}

const getProvinceData = (data) => {
  const locationsArray = Object.entries(data.locations);
  const provinceData = {};
  locationsArray.map(([key, value]) => {
    return {
      key,
      ...value
    }
  })
  .filter(location => location.location && location.location.province !== '')
  .forEach(location => {
    if (provinceData[location.location.country] === undefined) {
      provinceData[location.location.country] = [];
    }
    provinceData[location.location.country].push(location)
  });
  return provinceData;
}

export { addLatestStats, getCountryData, getProvinceData };
