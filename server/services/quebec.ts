
import got from 'got';
import cache from "../helpers/cache";
import dayjs from "dayjs";
import parse from "csv-parse/lib/sync";
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

const getCsvData = async (cacheKey: string, page: string, getRowData: Function) => {
  let data = cache.get(cacheKey);

  if ( data === undefined ) {
    const date = new Date();
    const time = date.getTime();
    
    const url = `https://www.inspq.qc.ca/sites/default/files/covid/donnees/${page}.csv?randNum=${time}`;
    const response: any = await got(url).text();
    const records = parse(response, {
      columns: true,
      skip_empty_lines: true
    })
    const rowData = getRowData(records)

    data = {
      data: rowData,
    }

    cache.set(cacheKey, data, 600);
  }

  return data;
}

const getSummaryRowData = (entries: any) => {
  const entry = entries[0];

  const cases = normalizeInteger(entry.cas);
  const deaths = normalizeInteger(entry.deces);
  const hospitalizations = normalizeInteger(entry.hospit);
  const intensive = normalizeInteger(entry.soins);
  const recovered = normalizeInteger(entry.gueris);
  const investigation = normalizeInteger(entry.invest);
  const date = dayjs(entry.date, "DD/MM/YYYY").format("MM/DD/YYYY");

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
  const summaryData = await getCsvData("quebecSummary", 'tuiles', getSummaryRowData);
  return summaryData;
}

const getConfirmedRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry['Date'], "DD/MM/YYYY").format("MM/DD/YYYY");
    const confirmed = normalizeInteger(entry['Nombre cumulatif de cas']);
    let daily = normalizeInteger(entry['Nouveaux cas']);

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
  const confirmedData = await getCsvData("quebecConfirmed", 'graph1', getConfirmedRowData);
  return confirmedData;
}

const getDeathsRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry['Date'], "DD/MM/YYYY").format("MM/DD/YYYY");
    const deaths = normalizeInteger(entry['Nombre cumulatif de décès']);
    let daily = normalizeInteger(entry['Nouveaux décès']);

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
  const deathsData = await getCsvData("quebecDeaths", 'graph2', getDeathsRowData);
  return deathsData;
}


const getHospitalizationRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry['Date'], "DD/MM/YYYY").format("MM/DD/YYYY");
    const hospitalizations = normalizeInteger(entry['Hospitalisations']);
    const intensive = normalizeInteger(entry['Soins intensifs']);

    history.push({
      date,
      hospitalizations,
      intensive,
    })
  })

  return history;
}

const getHospitalizationData = async () => {
  const hospitalizationData = await getCsvData("quebecHospitalization", 'graph3', getHospitalizationRowData);
  return hospitalizationData;
}

const getAnalysisRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry['Date'], "DD/MM/YYYY").format("MM/DD/YYYY");
    const negative = normalizeInteger(entry['Cumul des personnes avec des analyses négatives']);
    const positive = normalizeInteger(entry['Cumul de cas confirmés']);

    history.push({
      date,
      negative,
      positive,
    })
  })

  return history;
}

const getAnalysisData = async () => {
  const analysisData = await getCsvData("quebecAnalysis", 'graph4', getAnalysisRowData);
  return analysisData;
}

const getCasesPerRegionRowData = (entries: any) => {
  const regions: any = [];

  entries.forEach((entry: any) => {
    const region = entry['State'];
    const cases = normalizeInteger(entry['Cas']);
    const population = normalizeInteger(entry['Population']);
    const perHundred = normalizeFloat(entry['Taux']);

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
  const regionData = await getCsvData("quebecCasesPerRegion", 'graph5', getCasesPerRegionRowData);
  return regionData;
}

const getCasesByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    const ageGroup = entry['Groupe d\'âge'].replace(/ans/, 'years').replace(/et plus/, 'and above');
    const cases = normalizeInteger(entry['Proportion de cas confirmés']);

    data.push({
      ageGroup,
      cases,
    })
  })

  return data;
}

const getCasesByAgeData = async () => {
  const casesByAgeData = await getCsvData("quebecCasesByAge", 'graph7', getCasesByAgeRowData);
  return casesByAgeData;
}

const getDeathsByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    const ageGroup = entry['Groupe d\'âge'].replace(/ans/, 'years').replace(/et plus/, 'and above');
    const deaths = normalizeInteger(entry['Nombre de décès']);

    data.push({
      ageGroup,
      deaths,
    })
  })

  return data;
}

const getDeathsByAgeData = async () => {
  const deathsByAgeData = await getCsvData("quebecDeathsByAge", 'graph8', getDeathsByAgeRowData);
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
