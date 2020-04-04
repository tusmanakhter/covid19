
import got from 'got';
import parse from "csv-parse/lib/sync";
import cache from "../helpers/cache";

const baseUrl = 'https://health-infobase.canada.ca/src/data/covidLive/';

enum Properties {
  Region = 'prname',
  Date = 'date',
  Confirmed = 'numconf',
  Probable = 'numprob',
  Deaths = 'numdeaths',
  Total = 'numtotal',
  Today = 'numtoday',
  PercentToday = 'percentoday',
  Tested = 'numtested',
}

const getHistoryData = async () => {
  const url = `${baseUrl}/covid19.csv`;
  const response = await got(url).text();
  const records = parse(response, {
    columns: true,
    skip_empty_lines: true
  })

  let data = {};

  for (const record of records) {
    const region = record[Properties.Region];
    const date = record[Properties.Date];
    const confirmed = parseInt(record[Properties.Confirmed]);
    const deaths = parseInt(record[Properties.Deaths]);
    const today = parseInt(record[Properties.Today]);
    const percentToday = parseFloat(record[Properties.PercentToday]);

    if (!data[region]) {
      data[region] = []
    }

    data[region].push({
      date,
      confirmed,
      deaths,
      today,
      percentToday,
    });
  }

  return data;
};

const getLastUpdate = async () => {
  const url = `${baseUrl}/covid19-updateTime.csv`;
  const response = await got(url).text();
  const lastUpdate = response.trim();
  return lastUpdate;
}

const getCanadaData = async () => {
  let history = cache.get("canadaHistory");
  if ( history === undefined ) {
    history = await getHistoryData();
    cache.set("canadaHistory", history, 600);
  }

  let lastUpdate = cache.get("canadaLastUpdate");
  if ( lastUpdate === undefined ) {
    lastUpdate = await getLastUpdate();
    cache.set("canadaLastUpdate", lastUpdate, 600);
  }

  const response = {
    lastUpdate,
    regions: history,
  }

  return response;
}

export { getCanadaData, getHistoryData };
