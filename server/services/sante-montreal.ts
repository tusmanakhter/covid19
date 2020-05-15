
import got from 'got';
import cheerio from 'cheerio';
import dayjs from 'dayjs'
import 'dayjs/locale/fr-ca'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const baseUrl = 'https://santemontreal.qc.ca/population/coronavirus-covid-19';

const getMontrealData = async () => {
  const response: any = await got(baseUrl).text();
  const html = cheerio.load(response);
  const header = html("th:contains('Arrondissement ou ville liée')")
  const table = header.closest('table');
  const trs = table.find('tbody tr');
  const neighbourhoodData = trs.map((index, element) => {
    let location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*|\d/g, '');
    if (location.includes('Territoire')) {
      location = 'Territory to be confirmed';
    }
    const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
    const confirmed = sanitizeInt(confirmedString);
    const distributionString = html(element).find('td:nth-of-type(3)').text();
    const distribution = sanitizeFloat(distributionString);
    const perHundredString = html(element).find('td:nth-of-type(4)').text();
    const perHundred = sanitizeFloat(perHundredString);
    const deathsString = html(element).find('td:nth-of-type(5)').text().trim();
    const deaths = sanitizeInt(deathsString);
    const perHundredDeathsString = html(element).find('td:nth-of-type(6)').text().trim();
    const perHundredDeaths = sanitizeFloat(perHundredDeathsString);
    return { location, confirmed, distribution, perHundred, deaths, perHundredDeaths }
  }).get();
  const total = neighbourhoodData.pop();
  neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);

  const timeRegex = /.*date\sdu\s(\d+)\s(\w+)\s(\d+).*/i;
  const time = table.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 -0400');
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
  const header = html("th:contains('Groupe d'âge')");
  const table = header.closest('table');
  const trs = table.find('tbody tr');
  const ageData = trs.map((index, element) => {
    let ageGroup = html(element).find('td:nth-of-type(1)').text().trim();
    if (ageGroup.includes('Manquant')) {
      ageGroup = 'Missing';
    }
    const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
    const confirmed = sanitizeInt(confirmedString);
    const distributionString = html(element).find('td:nth-of-type(3)').text();
    const distribution = sanitizeFloat(distributionString);
    const perHundredString = html(element).find('td:nth-of-type(4)').text();
    const perHundred = sanitizeFloat(perHundredString);
    const deathsString = html(element).find('td:nth-of-type(5)').text().trim();
    const deaths = sanitizeInt(deathsString);
    const perHundredDeathsString = html(element).find('td:nth-of-type(6)').text().trim();
    const perHundredDeaths = sanitizeFloat(perHundredDeathsString);
    return { ageGroup, confirmed, distribution, perHundred, deaths, perHundredDeaths }
  }).get();
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
