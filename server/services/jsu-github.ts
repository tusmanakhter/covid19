
import got from "got";
import parse from "csv-parse/lib/sync";

const baseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_";

enum Properties {
  Country = "Country/Region",
  Province = "Province/State",
  Lat = "Lat",
  Long = "Long"
}

enum Category {
  Confirmed = "confirmed",
  Deaths = "deaths"
}

const getCategory = async (category: Category) => {
  const url = `${baseUrl}${category}_global.csv`

  const response = await got(url).text();

  const records = parse(response, {
    columns: true,
    skip_empty_lines: true
  })

  const data = {};

  for (const record of records) {
    const country = record[Properties.Country];
    const province = record[Properties.Province];
    const lat = parseFloat(record[Properties.Lat]);
    const long = parseFloat(record[Properties.Long]);

    let key: string;
    if (province === "") {
      key = country;
    } else {
      key = `${province}, ${country}`
    }

    const dateEntries = Object.entries<string>(record).slice(4);

    const history = {}
    for (const dataEntry of dateEntries) {
      const dateKey = new Date(dataEntry[0]).getTime();
      const value = parseInt(dataEntry[1], 10);
      history[dateKey] = value;
    }

    const result = {
      location: {
        country,
        province,
        lat,
        long
      },
      history
    }

    data[key] = result;
  }

  return data;
}

const mergeCategories = (confirmed: ILocationDict, deaths: ILocationDict) => {
  const globalHistory = {};
  const countryHistory = {};

  const merged: any = {}
  const locationKeys = Object.keys(confirmed);

  for (const locationKey of locationKeys) {
    const key = locationKey;
    const locationConfirmed = confirmed[key];
    const locationDeaths = deaths[key];
    const { location, history: confirmedHistory } = locationConfirmed;

    let deathsHistory: IHistoryDict;
    if (locationDeaths) {
      deathsHistory = locationDeaths.history;
    } else {
      deathsHistory = {}
    }

    const history = [];
    const dateKeys = Object.keys(confirmedHistory);
    for (const dateKey of dateKeys) {
      const dateConfirmed = confirmedHistory[dateKey];
      let dateDeaths = deathsHistory[dateKey]
      if (!dateDeaths) {
        dateDeaths = 0
      }

      if (!globalHistory[dateKey]) {
        globalHistory[dateKey] = {
          confirmed: 0,
          deaths: 0,
        }
      };

      globalHistory[dateKey].confirmed += dateConfirmed;
      globalHistory[dateKey].deaths += dateDeaths;

      if (location.province !== '') {
        if (!countryHistory[location.country]) {
          countryHistory[location.country] = {};
        };

        if (!countryHistory[location.country][dateKey]) {
          countryHistory[location.country][dateKey] = {
            confirmed: 0,
            deaths: 0,
          }
        }

        countryHistory[location.country][dateKey].confirmed += dateConfirmed;
        countryHistory[location.country][dateKey].deaths += dateDeaths;
      };

      const historyDate = {
        date: parseInt(dateKey, 10),
        confirmed: dateConfirmed,
        deaths: dateDeaths,
      }
      history.push(historyDate);
    }

    merged[key] = {
      location,
      history
    }
  }

  merged.global = { history: dictToArray(globalHistory) };

  const countryEntries = Object.entries<IStatsDict>(countryHistory);

  for (const countryEntry of countryEntries) {
    const key = countryEntry[0];
    const value = countryEntry[1];
    merged[key] = { history: dictToArray(value) };
  }

  return merged;
}

const dictToArray = (dictionary: IStatsDict) => {
  const array = [];
  const dateKeys = Object.entries(dictionary);

  for (const dateKey of dateKeys) {
    const key = dateKey[0];
    const value = dateKey[1];
    array.push({ date: parseInt(key, 10), ...value });
  }

  return array;
}

const getAllCategories = async () => {
  const [confirmed, deaths] = await Promise.all([
    getCategory(Category.Confirmed),
    getCategory(Category.Deaths),
  ]);

  const merged = mergeCategories(confirmed, deaths);
  return merged;
}

interface ILocationDict {
  [key: string]: ILocation
}

interface ILocation {
  location: {
    country: string,
    province: string,
    lat: number,
    long: number
  },
  history: IHistoryDict
}

interface IHistoryDict {
  [key: string]: number
}

interface IStatsDict {
  [key: string]: IStats
}

interface IStats {
  confirmed: number,
  deaths: number,
  active: number
}

export { getAllCategories };
