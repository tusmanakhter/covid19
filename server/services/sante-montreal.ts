
import got from 'got';
import cheerio from 'cheerio';
import dayjs from 'dayjs'
import 'dayjs/locale/fr-ca'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const baseUrl = 'https://santemontreal.qc.ca/population/coronavirus-covid-19/situation-du-coronavirus-covid-19-a-montreal';

const getMontrealData = async () => {
  const response: any = await got(baseUrl).text();
  const html = cheerio.load(response);

  const headerCases = html("h3:contains('Nombre de cas confirmés par arrondissement de Montréal ou par ville liée')")
  const tableCases = headerCases.next().find('table');
  const trsCases = tableCases.find('tbody tr');
  const neighbourhoodDataCases = trsCases.map((index, element) => {
    let location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*|\d/g, '');
    if (location.includes('Territoire')) {
      location = 'Territory to be confirmed';
    }
    const confirmedString = html(element).find('td:nth-of-type(5)').text().trim();
    const confirmed = sanitizeInt(confirmedString);
    const perHundredString = html(element).find('td:nth-of-type(6)').text();
    const perHundred = sanitizeFloat(perHundredString);
    return { location, confirmed, perHundred }
  }).get();

  const headerDeaths = html("h3:contains('Nombre de décès par arrondissement de Montréal ou par ville liée')")
  const tableDeaths = headerDeaths.next().find('table');
  const trsDeaths = tableDeaths.find('tbody tr');
  const neighbourhoodDataDeaths = trsDeaths.map((index, element) => {
    let location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*|\d/g, '');
    if (location.includes('Territoire')) {
      location = 'Territory to be confirmed';
    }
    const deathsString = html(element).find('td:nth-of-type(4)').text().trim();
    const deaths = sanitizeInt(deathsString);
    const perHundredDeathsString = html(element).find('td:nth-of-type(5)').text().trim();
    const perHundredDeaths = sanitizeFloat(perHundredDeathsString);
    return { location, deaths, perHundredDeaths }
  }).get();

  const neighbourhoodData = neighbourhoodDataCases.map(cases => ({
    ...neighbourhoodDataDeaths.find((deaths) => (deaths.location === cases.location) && deaths),
    ...cases
  }));

  const total = neighbourhoodData.pop();

  neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);

  const timeRegex = /.*date\sdu\s(\d+)\s(\w+)\s(\d+).*/i;
  const time = tableCases.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 -0400');
  const lastUpdate = dayjs(time, 'DD MMMM YYYY HH ZZ', 'fr-ca');

  const montrealData = {
    confirmed: total.confirmed,
    perHundred: total.perHundred,
    deaths: total.deaths,
    perHundredDeaths: total.perHundredDeaths,
    lastUpdate,
    locations: neighbourhoodData
  }

  return montrealData;
}

const getMontrealAgeData = async () => {
  const response: any = await got(baseUrl).text();
  const html = cheerio.load(response);

  const headerCases = html("h3:contains('Nombre de cas confirmés par groupe d'âge')")
  const tableCases = headerCases.next().find('table');
  const trsCases = tableCases.find('tbody tr');
  const ageDataCases = trsCases.map((index, element) => {
    let ageGroup = html(element).find('td:nth-of-type(1)').text().trim();
    if (ageGroup.includes('Manquant')) {
      ageGroup = 'Missing';
    }
    const confirmedString = html(element).find('td:nth-of-type(5)').text().trim();
    const confirmed = sanitizeInt(confirmedString);
    const perHundredString = html(element).find('td:nth-of-type(6)').text();
    const perHundred = sanitizeFloat(perHundredString);
    return { ageGroup, confirmed, perHundred }
  }).get();

  const headerDeaths = html("h3:contains('Nombre de décès par groupe d'âge')")
  const tableDeaths = headerDeaths.next().find('table');
  const trsDeaths = tableDeaths.find('tbody tr');
  const ageDataDeaths = trsDeaths.map((index, element) => {
    let ageGroup = html(element).find('td:nth-of-type(1)').text().trim();
    if (ageGroup.includes('Manquant')) {
      ageGroup = 'Missing';
    }
    const deathsString = html(element).find('td:nth-of-type(4)').text().trim();
    const deaths = sanitizeInt(deathsString);
    const perHundredDeathsString = html(element).find('td:nth-of-type(5)').text().trim();
    const perHundredDeaths = sanitizeFloat(perHundredDeathsString);
    return { ageGroup, deaths, perHundredDeaths }
  }).get();

  const ageData = ageDataCases.map(cases => ({
    ...ageDataDeaths.find((deaths) => (deaths.ageGroup === cases.ageGroup) && deaths),
    ...cases
  }));
  
  ageData.pop();

  return ageData;
}

const sanitizeFloat = (float: string) => {
  let sanitizedNum = parseFloat(float.replace(/n\.p\.|-/g, '0').replace(/,/g, '.').replace(/\*|\s/g, '').replace(/\,/g, '.'));
  if (isNaN(sanitizedNum)) {
    sanitizedNum = 0;
  }
  return sanitizedNum;
}

const sanitizeInt = (int: string) => {
  return parseInt(int.replace(/n\.p\.|-/g, '0').replace(/<|\s/g, ''), 10);
}

export { getMontrealData, getMontrealAgeData };
