
import got from 'got';
import cheerio from 'cheerio';
import dayjs from 'dayjs'
import cache from "../helpers/cache";

const baseUrl = 'https://santemontreal.qc.ca/en/public/coronavirus-covid-19';

const getMontrealData = async () => {
  let montrealData = cache.get("montreal");
  if ( montrealData === undefined ) {
    const response: any = await got(baseUrl).text();
    const html = cheerio.load(response);
    const header = html("th:contains('Borough or linked city*')");
    const timeRegex = /TOTAL NUMBER OF CONFIRMED CASES (\d+) (\w+), (\d+:\d+) (\w)\.(\w)\./i;
    const time = header.next('th').text().trim().replace(timeRegex, '$1 $2 2020 $3 $4$5').toUpperCase();
    const table = header.closest('table').find('tbody tr');
    const neighbourhoodData = table.map((index, element) => {
      let location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*/g, '');
      const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
      const confirmed = parseInt(confirmedString.replace(/,/g, ''), 10)
      return { location, confirmed }
    }).get();
    const total = neighbourhoodData.pop();
    neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);
    const lastUpdate = dayjs(time).valueOf();

    montrealData = {
      total: total.confirmed,
      lastUpdate,
      locations: neighbourhoodData
    }
    cache.set("montreal", montrealData, 600);
  }

  return montrealData;
}

export { getMontrealData };
