
import got from 'got';
import cache from "../helpers/cache";

const baseUrl = 'https://spreadsheets.google.com/feeds/list/1kmCbHvJFHe70GZNqOTP-sHjYDvJ_pa7zn2-gJhCNP3g/';
const urlEnd = '/public/values?alt=json';

const getSheetsData = async (cacheKey: string, sheetPage: number, getRowData: Function) => {
  let data = cache.get(cacheKey);

  if ( data === undefined ) {
    const url = `${baseUrl}${sheetPage}${urlEnd}`;
    const response: any = await got(url).json();
    const lastUpdate = response.feed.updated.$t;
    const entries = response.feed.entry;
    const rowData = getRowData(entries)

    data = {
      lastUpdate,
      data: rowData,
    }

    cache.set(cacheKey, data, 600);
  }

  return data;
}

const getConfirmedRowData = (entries: any) => {
  const history: any = [];
  
  entries.forEach((entry: any) => {
    const date = entry.gsx$date.$t;
    const confirmed = parseInt(entry.gsx$nombrecumulatifdecas.$t, 10);
    let daily = parseInt(entry.gsx$nouveauxcas.$t, 10);

    // Handle first row
    if (isNaN(daily)){
      daily = confirmed;
    }

    history.push({
      date,
      confirmed,
      daily,
    })
  })

  return history;
}

const getConfirmedData = async () => {
  const confirmedData = await getSheetsData("quebecConfirmed", 1, getConfirmedRowData);
  return confirmedData;
}

const getDeathsRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = entry.gsx$date.$t;
    const deaths = parseInt(entry.gsx$nombrecumulatifdedécès.$t, 10);
    let daily = parseInt(entry.gsx$nouveauxdécès.$t, 10);

    // Handle first row
    if (isNaN(daily)){
      daily = deaths;
    }

    history.push({
      date,
      deaths,
      daily,
    })
  })

  return history;
}

const getDeathsData = async () => {
  const deathsData = await getSheetsData("quebecDeaths", 2, getDeathsRowData);
  return deathsData;
}


const getHospitalizationRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = entry.gsx$date.$t;
    const hospitalizations = parseInt(entry.gsx$hospitalisations.$t, 10);
    const intensive = parseInt(entry.gsx$soinsintensifs.$t, 10);

    history.push({
      date,
      hospitalizations,
      intensive,
    })
  })

  return history;
}

const getHospitalizationData = async () => {
  const hospitalizationData = await getSheetsData("quebecHospitalization", 3, getHospitalizationRowData);
  return hospitalizationData;
}

const getAnalysisRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = entry.gsx$date.$t;
    const negative = parseInt(entry.gsx$cumuldepersonnesavecanalysesnégatives.$t, 10);
    const positive = parseInt(entry.gsx$cumuldecasconfirmés.$t, 10);

    history.push({
      date,
      negative,
      positive,
    })
  })

  return history;
}

const getAnalysisData = async () => {
  const analysisData = await getSheetsData("quebecAnalysis", 4, getAnalysisRowData);
  return analysisData;
}

const getCasesPerRegionRowData = (entries: any) => {
  const regions: any = [];

  entries.forEach((entry: any) => {
    const region = entry.gsx$state.$t;
    const cases = parseInt(entry.gsx$cas.$t, 10);
    const population = parseInt(entry.gsx$population.$t, 10);
    const perHundred = parseFloat(entry.gsx$taux.$t);

    regions.push({
      region,
      cases,
      population,
      perHundred,
    });
  })

  regions.sort((a: any, b: any) => { return b.cases - a.cases })

  return regions;
}

const getCasesPerRegionData = async () => {
  const regionData = await getSheetsData("quebecCasesPerRegion", 5, getCasesPerRegionRowData);
  return regionData;
}

const getCasesByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    const ageGroup = entry.gsx$groupedâge.$t.replace(/ans/, 'years').replace(/et plus/, 'and above');
    const cases = parseInt(entry.gsx$proportiondecasconfirmés.$t, 10);

    data.push({
      ageGroup,
      cases,
    })
  })

  return data;
}

const getCasesByAgeData = async () => {
  const casesByAgeData = await getSheetsData("quebecCasesByAge", 7, getCasesByAgeRowData);
  return casesByAgeData;
}

const getDeathsByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    const ageGroup = entry.gsx$groupedâge.$t.replace(/ans/, 'years').replace(/et plus/, 'and above');
    const deaths = parseInt(entry.gsx$nombrededécès.$t, 10);

    data.push({
      ageGroup,
      deaths,
    })
  })

  return data;
}

const getDeathsByAgeData = async () => {
  const deathsByAgeData = await getSheetsData("quebecDeathsByAge", 8, getDeathsByAgeRowData);
  return deathsByAgeData;
}

const getQuebecData = async () => {
  const [confirmed, deaths, hospitalizations, analysis, casesPerRegion, casesByAge, deathsByAge]: any = await Promise.all([
    getConfirmedData(),
    getDeathsData(),
    getHospitalizationData(),
    getAnalysisData(),
    getCasesPerRegionData(),
    getCasesByAgeData(),
    getDeathsByAgeData(),
  ]);

  const ageData = casesByAge.data.map((item, i) => Object.assign({}, item, deathsByAge.data[i]));

  const byAge = {
    lastUpdate: casesByAge.lastUpdate,
    data: ageData,
  }

  return {
    confirmed,
    deaths,
    hospitalizations,
    analysis,
    casesPerRegion,
    byAge,
  }
}

export { getQuebecData, getConfirmedData };
