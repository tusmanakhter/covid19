const mergeDateResults = (confirmed, deaths, hospitalizations, analysis) => {
  const deathsDict = getDateDict(deaths.data);
  const hospitalizationsDict = getDateDict(hospitalizations.data);
  const analysisDict = getDateDict(analysis.data);

  const merged = {};
  confirmed.data.forEach((item) => {
    let deathsData, hospitalizationData, analysisData;

    if (deathsDict[item.date]) {
      const deathDateItem = deathsDict[item.date];
      deathsData = {
        deaths: deathDateItem.deaths,
        deathsDaily: deathDateItem.daily,
      };
    } else {
      deathsData = {
        deaths: null,
        deathsDaily: null,
      }
    }

    if (hospitalizationsDict[item.date]) {
      hospitalizationData = hospitalizationsDict[item.date];
    } else {
      hospitalizationData = {
        hospitalizations: null,
        intensive: null,
      }
    }

    if (analysisDict[item.date]) {
      analysisData = analysisDict[item.date];
    } else {
      analysisData = {
        negative: null,
        positive: null,
      }
    }

    merged[item.date] = {
      confirmed: item.confirmed,
      confirmedDaily: item.daily,
      ...deathsData,
      ...hospitalizationData,
      ...analysisData,
      totalTests: analysisData.negative + analysisData.positive,
    }
  })

  const mergedArray = Object.entries(merged).map(([key, item]) => {
    return {
      date: key,
      ...item
    }
  })

  return mergedArray;
}

const getDateDict = (array) => {
  const dict = array.reduce(function(map, obj) {
    const { date, ...rest } = obj;
    map[date] = { ...rest };
    return map;
  }, {});
  return dict;
}

export { mergeDateResults };