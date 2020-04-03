
import got from 'got';
import cheerio from 'cheerio';
import dayjs from 'dayjs'
import cache from "../helpers/cache";

const baseUrl = 'https://santemontreal.qc.ca/en/public/coronavirus-covid-19';

const getMontrealData = async () => {
  let montrealData = cache.get("montreal");
  montrealData = undefined;
  if ( montrealData === undefined ) {
    const response: any = await got(baseUrl).text();
    const html = cheerio.load(response);
    const header = html("th:contains('Borough or linked city')");
    const table = header.closest('table');
    const trs = table.find('tbody tr');
    const neighbourhoodData = trs.map((index, element) => {
      const location = html(element).find('td:nth-of-type(1)').text().trim().replace(/\*/g, '');
      const confirmedString = html(element).find('td:nth-of-type(2)').text().trim();
      const confirmed = parseInt(confirmedString.replace(/,|</g, ''), 10);
      const distributionString = html(element).find('td:nth-of-type(3)').text();
      const distribution = parseFloat(distributionString.replace(/\s/g, '0'));
      const perHundredString = html(element).find('td:nth-of-type(4)').text();
      const perHundred = parseFloat(perHundredString.replace(/\s|n\.p\.|\*\s/g, '0'));
      return { location, confirmed, distribution, perHundred }
    }).get();
    const total = neighbourhoodData.pop();
    neighbourhoodData.sort((a, b) => b.confirmed - a.confirmed);

    const timeRegex = /.*extracted on (\w+) (\d+)\w\w (\d+:\d+) (\w\w).*/i;
    const time = table.next().text().trim().replace(timeRegex, '$1 $2 2020 $3 $4').toUpperCase();
    const lastUpdate = dayjs(time).valueOf();

    montrealData = {
      confirmed: total.confirmed,
      perHundred: total.perHundred,
      lastUpdate,
      locations: neighbourhoodData
    }
    cache.set("montreal", montrealData, 600);
  }

  return montrealData;
}

export { getMontrealData };
