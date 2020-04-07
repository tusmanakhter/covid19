
import got from 'got';
import cache from "../helpers/cache";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
import { getCanadaCases } from "../helpers/cases";
dayjs.extend(customParseFormat);

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

const getSummaryRowData = (entries: any) => {
  const entry = entries[0];

  const cases = normalizeInteger(entry.gsx$cas.$t);
  const deaths = normalizeInteger(entry.gsx$deces.$t);
  const hospitalizations = normalizeInteger(entry.gsx$hospit.$t);
  const intensive = normalizeInteger(entry.gsx$soins.$t);
  const recovered = normalizeInteger(entry.gsx$gueris.$t);
  const investigation = normalizeInteger(entry.gsx$invest.$t);
  const date = dayjs(entry.gsx$date.$t, "DD/MM/YYYY").format("MM/DD/YYYY");

  const summary = {
    cases,
    deaths,
    hospitalizations,
    intensive,
    recovered,
    investigation,
    date
  }

  return summary;
}

const getSummaryData = async () => {
  const summaryData = await getSheetsData("quebecSummary", 1, getSummaryRowData);
  return summaryData;
}

const getConfirmedRowData = (entries: any) => {
  const history: any = [];
  
  entries.forEach((entry: any) => {
    const date = dayjs(entry.gsx$date.$t, "DD/MM/YYYY").format("MM/DD/YYYY");
    const confirmed = normalizeInteger(entry.gsx$nombrecumulatifdecas.$t);
    let daily = normalizeInteger(entry.gsx$nouveauxcas.$t);

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
  const confirmedData = await getSheetsData("quebecConfirmed", 2, getConfirmedRowData);
  return confirmedData;
}

const getDeathsRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry.gsx$date.$t, "DD/MM/YYYY").format("MM/DD/YYYY");
    const deaths = normalizeInteger(entry.gsx$nombrecumulatifdedécès.$t);
    let daily = normalizeInteger(entry.gsx$nouveauxdécès.$t);

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
  const deathsData = await getSheetsData("quebecDeaths", 3, getDeathsRowData);
  return deathsData;
}


const getHospitalizationRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry.gsx$date.$t, "DD/MM/YYYY").format("MM/DD/YYYY");
    const hospitalizations = normalizeInteger(entry.gsx$hospitalisations.$t);
    const intensive = normalizeInteger(entry.gsx$soinsintensifs.$t);

    history.push({
      date,
      hospitalizations,
      intensive,
    })
  })

  return history;
}

const getHospitalizationData = async () => {
  const hospitalizationData = await getSheetsData("quebecHospitalization", 4, getHospitalizationRowData);
  return hospitalizationData;
}

const getAnalysisRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry.gsx$date.$t, "DD/MM/YYYY").format("MM/DD/YYYY");
    const negative = normalizeInteger(entry.gsx$cumuldepersonnesavecanalysesnégatives.$t);
    const positive = normalizeInteger(entry.gsx$cumuldecasconfirmés.$t);

    history.push({
      date,
      negative,
      positive,
    })
  })

  return history;
}

const getAnalysisData = async () => {
  const analysisData = await getSheetsData("quebecAnalysis", 5, getAnalysisRowData);
  return analysisData;
}

const getCasesPerRegionRowData = (entries: any) => {
  const regions: any = [];

  entries.forEach((entry: any) => {
    const region = entry.gsx$state.$t;
    const cases = normalizeInteger(entry.gsx$cas.$t);
    const population = normalizeInteger(entry.gsx$population.$t);
    const perHundred = normalizeFloat(entry.gsx$taux.$t);

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
  const regionData = await getSheetsData("quebecCasesPerRegion", 6, getCasesPerRegionRowData);
  return regionData;
}

const getCasesByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    const ageGroup = entry.gsx$groupedâge.$t.replace(/ans/, 'years').replace(/et plus/, 'and above');
    const cases = normalizeInteger(entry.gsx$proportiondecasconfirmés.$t);

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
    const deaths = normalizeInteger(entry.gsx$nombrededécès.$t);

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
  const [summary, confirmed, deaths, hospitalizations, analysis, casesPerRegion, casesByAge, deathsByAge]: any = await Promise.all([
    getSummaryData(),
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
  
  const lastAnalysis = analysis.data.splice(-1).pop();
  const canadaCases = await getCanadaCases();

  summary.data.negative = lastAnalysis.negative;
  summary.data.totalTests = lastAnalysis.negative + lastAnalysis.positive;
  summary.data.percentCanada = parseFloat(((summary.data.cases/canadaCases)*100).toFixed(2));

  return {
    summary,
    confirmed,
    deaths,
    hospitalizations,
    analysis,
    casesPerRegion,
    byAge,
  }
}

const normalizeInteger = (integer: string) => {
  return parseInt(integer.replace(/\s/g,''), 10);
}

const normalizeFloat = (float: string) => {
  return parseFloat(float.replace(/\s/g,''));
}

export { getQuebecData, getConfirmedData };
