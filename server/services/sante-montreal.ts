
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
    const table = html('table').first().find('tbody tr');
    const time = html('h4').first().text().trim().replace(/Last data update: |\.|\,/g, '').toUpperCase();
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
