
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
    const confirmed = parseInt(confirmedString.replace(/,|<|\s/g, ''), 10);
    const distributionString = html(element).find('td:nth-of-type(3)').text();
    const distribution = parseFloat(distributionString.replace(/\s|-/g, '0'));
    const perHundredString = html(element).find('td:nth-of-type(4)').text();
    const perHundred = parseFloat(perHundredString.replace(/n\.p\.|\*|-/g, '0').replace(/,|\s/g, ''));
    return { location, confirmed, distribution, perHundred }
  }).get();
  const total = neighbourhoodData.pop();
  neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);

  let timeRegex = /.*extracted\son\s(\w+)\s(\d+).*(\d+)(\:\d+)*.*\s(\w\.*\w).*/i;
  let time = table.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 $4 EDT').toUpperCase();
  let lastUpdate = dayjs(time);

  if (isNaN(lastUpdate.valueOf())) {
    timeRegex = /.*date\sdu\s(\d+)\s(\w+)\s(\d+).*/i;
    time = table.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 -0400');
    lastUpdate = dayjs(time, 'DD MMMM YYYY HH ZZ', 'fr-ca');
  }

  const montrealData = {
    confirmed: total.confirmed,
    perHundred: total.perHundred,
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

export { getMontrealData, getMontrealAgeData };
