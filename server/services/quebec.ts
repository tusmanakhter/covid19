
import got from 'got';
import cache from "../helpers/cache";
import parse from "csv-parse/lib/sync";
import { getCanadaCases } from "../helpers/cases";
import dayjs from "dayjs";
import 'dayjs/locale/fr-ca'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

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

    data = rowData,

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
  const date = dayjs(entry.date, "DD MMMM YYYY - HH", 'fr-ca').add(4, 'hour');

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

const getDateRowData = (entries: any) => {
  const history: any = [];

  entries.forEach((entry: any) => {
    const date = dayjs(entry['Date'], "DD/MM/YYYY").format("MM/DD/YYYY");
    const negative = normalizeInteger(entry['Cumul des personnes avec des analyses négatives']);
    const confirmed = normalizeInteger(entry['Cumul de cas confirmés']);
    const deaths = normalizeInteger(entry['Nombre cumulatif de décès']);
    const positive = confirmed;
    const hospitalizations = normalizeInteger(entry['Hospitalisations']);
    const intensive = normalizeInteger(entry['Soins intensifs']);
    const dailyDeaths = normalizeInteger(entry['Nouveaux décès']);
    const dailyConfirmed = normalizeInteger(entry['Nouveaux cas']);

    history.push({
      date,
      confirmed,
      dailyConfirmed,
      deaths,
      dailyDeaths,
      negative,
      positive,
      hospitalizations,
      intensive,
    })
  })

  return history;
}

const getDateData = async () => {
  const dateData = await getCsvData("quebecDate", 'combine', getDateRowData);
  return dateData;
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
  const [summary, date, casesPerRegion, casesByAge, deathsByAge]: any = await Promise.all([
    getSummaryData(),
    getDateData(),
    getCasesPerRegionData(),
    getCasesByAgeData(),
    getDeathsByAgeData(),
  ]);

  const ageData = casesByAge.map((item, i) => Object.assign({}, item, deathsByAge[i]));

  const byAge = ageData;
  const lastAnalysis = date.slice(-1).pop();

  const canadaCases = await getCanadaCases();

  summary.negative = lastAnalysis.negative;
  summary.totalTests = lastAnalysis.negative + lastAnalysis.positive;
  summary.percentCanada = parseFloat(((summary.cases/canadaCases)*100).toFixed(2));

  return {
    summary,
    date,
    casesPerRegion,
    byAge,
  }
}

const normalizeInteger = (integer: string) => {
  const parsed = parseInt(integer.replace(/\s/g,''), 10);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

const normalizeFloat = (float: string) => {
  const parsed = parseFloat(float.replace(/\s/g,''));
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

export { getQuebecData, getDateData };
