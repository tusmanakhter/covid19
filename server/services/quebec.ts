
import got from 'got';
import cache from "../helpers/cache";
import parse from "csv-parse/lib/sync";
import { Options } from "csv-parse";
import { getCanadaStats } from "../helpers/stats";
import dayjs from "dayjs";
import 'dayjs/locale/fr-ca'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const getDateData = async () => {
  const cacheKey = 'quebecDate';
  let data = cache.get('cacheKey');

  if ( data === undefined ) {
    const date = new Date();
    const time = date.getTime();
    
    const url = `https://www.inspq.qc.ca/sites/default/files/covid/donnees/combine.csv?randNum=${time}`;
    const response: any = await got(url).text();
    data = parseCsvData(getDateRowData, response);
    cache.set(cacheKey, data, 600);
  }

  return data;
}

const getOtherData = async () => {
  const cacheKey = 'quebecOther';
  let data = cache.get('cacheKey');

  if ( data === undefined ) {
    const date = new Date();
    const time = date.getTime();
    
    const url = `https://www.inspq.qc.ca/sites/default/files/covid/donnees/combine2.csv?randNum=${time}`;
    const response: any = await got(url).text();

    const summary = parseCsvData(getSummaryRowData, response, 2, 3);
    const casesPerRegion = parseCsvData(getCasesPerRegionRowData, response, 12, 30);
    const casesByAge = parseCsvData(getCasesByAgeRowData, response, 32, 42);
    const deathsByAge = parseCsvData(getDeathsByAgeRowData, response, 48, 58);
    
    data = {
      summary,
      casesPerRegion,
      casesByAge,
      deathsByAge,
    }
    cache.set(cacheKey, data, 600);
  }

  return data;
}

const parseCsvData = (getRowData: Function, responseData: string, from: number = null, to: number = null) => {
  const options: Options = {
    columns: true,
  }

  if (from && to) {
    options.from_line = from;
    options.to_line = to;
  }

  const records = parse(responseData, options).filter(item => item);
  const rowData = getRowData(records)
  const data = rowData;
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
  const date = dayjs(entry.date, "D MMMM YYYY - HH", 'fr-ca').add(4, 'hour');

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

const getCasesByAgeRowData = (entries: any) => {
  const data: any = [];

  entries.forEach((entry: any) => {
    console.log(entry);
    const ageGroup = entry['Groupe d\'âge'].replace(/ans/, 'years').replace(/et plus/, 'and above');
    const cases = normalizeInteger(entry['Proportion de cas confirmés']);

    data.push({
      ageGroup,
      cases,
    })
  })

  return data;
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

const getQuebecData = async () => {
  const [date, other]: any = await Promise.all([
    getDateData(),
    getOtherData(),
  ]);

  const ageData = other.casesByAge.map((item, i) => Object.assign({}, item, other.deathsByAge[i]));

  const byAge = ageData;
  const lastAnalysis = date.slice(-1).pop();

  const canadaCases = (await getCanadaStats()).cases;

  other.summary.negative = lastAnalysis.negative;
  other.summary.totalTests = lastAnalysis.negative + lastAnalysis.positive;
  other.summary.percentCanada = parseFloat(((other.summary.cases/canadaCases)*100).toFixed(2));

  return {
    summary: other.summary,
    date,
    casesPerRegion: other.casesPerRegion,
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
