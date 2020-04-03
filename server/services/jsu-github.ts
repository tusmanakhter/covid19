
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
  Recovered = "recovered",
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
      const dateKey = dataEntry[0];

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

const mergeCategories = (confirmed: ILocationDict, recovered: ILocationDict, deaths: ILocationDict) => {
  const merged = {};
  updateMergedDict(merged, confirmed, 'confirmed');
  updateMergedDict(merged, recovered, 'recovered');
  updateMergedDict(merged, deaths, 'deaths');

  const mergedValues = Object.entries<any>(merged);
  mergedValues.forEach(([location, value]) => {
    merged[location] = { history: dictToArray(value) }
  })

  return merged;
}

const dictToArray = (dictionary: IStatsDict) => {
  const array = [];
  const dateKeys = Object.entries(dictionary);

  for (const dateKey of dateKeys) {
    const key = dateKey[0];
    const value = dateKey[1];
    if (!value.confirmed) {
      value.confirmed = 0;
    }
    if (!value.deaths) {
      value.deaths = 0;
    }
    if (!value.recovered) {
      value.recovered = 0;
    }
    value.active = value.confirmed - (value.recovered + value.deaths);
    array.push({ date: key, ...value });
  }

  return array;
}

const getAllCategories = async () => {
  const [confirmed, recovered, deaths] = await Promise.all([
    getCategory(Category.Confirmed),
    getCategory(Category.Recovered),
    getCategory(Category.Deaths),
  ]);

  const merged = mergeCategories(confirmed, recovered, deaths);
  return merged;
}

const updateMergedDict = (merged: Object, dict: ILocationDict, type: string) => {
  if (!merged['global']) {
    merged['global'] = {};
  } 

  const locationKeys = Object.entries(dict);

  locationKeys.forEach(([locationKey, locationData]) => {
    const location = locationData.location;
    const dates = Object.entries(locationData.history);
    const isProvince = location.province !== '';
    const country = location.country;

    if (!merged[locationKey]) {
      merged[locationKey] = {};
    }

    if (isProvince && !merged[country]) {
      merged[country] = {};
    }

    dates.forEach(([date, count]) => {
      if (!merged[locationKey][date]) {
        merged[locationKey][date] = {};
      }

      if (!merged[locationKey][date][type]) {
        merged[locationKey][date][type] = 0;
      }

      merged[locationKey][date][type] += count;

      if (isProvince) {
        if (!merged[country][date]) {
          merged[country][date] = {};
        }

        if (!merged[country][date][type]) {
          merged[country][date][type] = 0;
        }

        merged[country][date][type] += count;
      }

      if (!merged['global'][date]) {
        merged['global'][date] = {};
      }
      
      if (!merged['global'][date][type]) {
        merged['global'][date][type] = 0;
      }

      merged['global'][date][type] += count;
    });
  });
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
  recovered: number,
  deaths: number,
  active: number
}

export { getAllCategories };
