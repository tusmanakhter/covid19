
import got from 'got';
import cheerio from 'cheerio';
import dayjs from 'dayjs'
import 'dayjs/locale/fr-ca'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const baseUrl = 'https://santemontreal.qc.ca/en/public/coronavirus-covid-19';

const getMontrealData = async () => {
  const response: any = await got(baseUrl).text();
  const html = cheerio.load(response);
  const header = html("th:contains('Borough or linked city'), th:contains('Arrondissement ou ville liée')")
  const table = header.closest('table');
  const trs = table.find('tbody tr');
  const neighbourhoodData = trs.map((index, element) => {
    let location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*|\d/g, '');
    if (location.includes('Territoire') || location.includes('Territory')) {
      location = 'Territory to be confirmed';
    }
    const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
    const confirmed = sanitizeStat(confirmedString);
    const distributionString = html(element).find('td:nth-of-type(3)').text();
    const distribution = parseFloat(distributionString.replace(/\s|-/g, '0'));
    const perHundredString = html(element).find('td:nth-of-type(4)').text();
    const perHundred = sanitizePerHundred(perHundredString);
    const deathsString = html(element).find('td:nth-of-type(5)').text().trim();
    const deaths = sanitizeStat(deathsString);
    const perHundredDeathsString = html(element).find('td:nth-of-type(6)').text().trim();
    const perHundredDeaths = sanitizePerHundred(perHundredDeathsString);
    return { location, confirmed, distribution, perHundred, deaths, perHundredDeaths }
  }).get();
  const total = neighbourhoodData.pop();
  neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);

  let timeRegex = /.*extracted\son\s(\w+)\s(\d+).*\s(\d+)(\:\d+)?\s?(\w)\.*(\w).*/i;
  let time = table.next().text().trim().replace(timeRegex, (g0: string, g1: string, g2: string, g3: string, g4: string, g5: string, g6: string) => {
    if (g4 === undefined) {
      g4 = ':00';
    }

    return `${g1} ${g2} 2020 ${g3}${g4} ${g5}${g6} EDT`
  }).toUpperCase();
  let lastUpdate = dayjs(time);

  if (isNaN(lastUpdate.valueOf())) {
    timeRegex = /.*date\sdu\s(\d+)\s(\w+)\s(\d+).*/i;
    time = table.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 -0400');
    lastUpdate = dayjs(time, 'DD MMMM YYYY HH ZZ', 'fr-ca');
  }

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
  const header = html("th:contains('Age group'), th:contains('Groupe d'âge')");
  const table = header.closest('table');
  const trs = table.find('tbody tr');
  const ageData = trs.map((index, element) => {
    const ageGroup = html(element).find('td:nth-of-type(1)').text().trim();
    const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
    const confirmed = parseInt(confirmedString.replace(/,|<|\s/g, ''), 10);
    const distributionString = html(element).find('td:nth-of-type(3)').text();
    const distribution = parseFloat(distributionString.replace(/\s|-/g, '0'));
    const perHundredString = html(element).find('td:nth-of-type(4)').text();
    const perHundred = parseFloat(perHundredString.replace(/n\.p\.|\*|-/g, '0').replace(/,|\s/g, ''));
    return { ageGroup, confirmed, distribution, perHundred }
  }).get();
  ageData.pop();

  return ageData;
}

const sanitizePerHundred = (perHundred: string) => {
  return parseFloat(perHundred.replace(/n\.p\.|\*|-/g, '0').replace(/,|\s/g, ''));
}

const sanitizeStat = (stat: string) => {
  return parseInt(stat.replace(/,|<|\s/g, ''), 10);
}

export { getMontrealData, getMontrealAgeData };
