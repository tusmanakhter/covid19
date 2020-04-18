const getIncrease = (stat, data, getPercent) => {
  const latest = data.latest[stat];
  const previous = data.history.slice(-1).pop()[stat];
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

export { getIncrease, getPercentTotal, getGlobalPercent};
