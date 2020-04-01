
import got from "got";

const baseUrl = "https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer";
const countryUrl = `${baseUrl}/2/query?f=json&returnGeometry=false&where=Confirmed%20%3E%200&outFields=Country_Region,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Active`;
const provinceUrl = `${baseUrl}/3/query?f=json&where=Confirmed%20%3E%200%20AND%20Province_State%20IS%20NOT%20NULL&returnGeometry=false&outFields=Country_Region,Province_State,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Active`;

const headers = {
  'authority': 'services9.arcgis.com',
  'cache-control': 'no-cache',
  'origin': 'https://gisanddata.maps.arcgis.com',
  'pragma': 'no-cache',
  'referer': 'https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html',
  'sec-fetch-site': "same-site",
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
}

enum Properties {
  Country = "Country_Region",
  Province = "Province_State",
  Lat = "Lat",
  Long = "Long_",
  Confirmed = "Confirmed",
  Recovered = "Recovered",
  Deaths = "Deaths",
  Active = "Active",
  LastUpdate = "Last_Update"
}

const getLatestDict = async (url: string) => {
  const response: any = await got(url, {headers}).json();
  const locations = response.features;
  const latest = {}

  for (const location of locations) {
    const record = location.attributes;
    const country = record[Properties.Country];
    const province = record[Properties.Province] ?? "";
    const lat = record[Properties.Lat];
    const long = record[Properties.Long];
    const confirmed = record[Properties.Confirmed];
    const recovered = record[Properties.Recovered];
    const deaths = record[Properties.Deaths];
    const active = record[Properties.Active];
    const lastUpdate = record[Properties.LastUpdate];

    let key: string;
    if (province === "") {
      key = country;
    } else {
      key = `${province}, ${country}`
    }

    const latestRecord = {
      location: {
        country,
        province,
        lat,
        long,
      },
      latest: {
        confirmed,
        recovered,
        deaths,
        active,
        lastUpdate
      }
    }

    latest[key] = latestRecord;
  }

  return latest;
}

const getLatest = async () => {
  const [province, country] = await Promise.all([
    getLatestDict(provinceUrl),
    getLatestDict(countryUrl)
  ]);

  const latestCountryValues = Object.values(country);
  const global = latestCountryValues.reduce((a: any, b: any) => {
    return {
      latest: {
        confirmed: a.latest.confirmed + b.latest.confirmed,
        recovered: a.latest.recovered + b.latest.recovered,
        deaths: a.latest.deaths + b.latest.deaths,
        active: a.latest.active + b.latest.active,
        lastUpdate: Math.max(a.latest.lastUpdate,  b.latest.lastUpdate),
      }
    }
  });

  const mergedDict = { global, ...province, ...country };
  return mergedDict;
}

export { getLatest };