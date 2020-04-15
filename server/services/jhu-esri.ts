
import got from "got";

const baseUrl = "https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Nc2JKvYFoAEOFCG5JSI6/FeatureServer";
const countryUrl = `${baseUrl}/2/query?f=json&returnGeometry=false&where=Confirmed%20%3E%200&outFields=Country_Region,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Incident_Rate`;
const provinceUrl = `${baseUrl}/3/query?f=json&where=Confirmed%20%3E%200%20AND%20Province_State%20IS%20NOT%20NULL&returnGeometry=false&outFields=Country_Region,Province_State,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Incident_Rate`;

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
  LastUpdate = "Last_Update",
  PerCapita = "Incident_Rate",
}

const getLatestDict = async (url: string) => {
  const response: any = await got(url, {headers}).json();
  const locations = response.features;
  const latest = {}

  for (const location of locations) {
    const record = location.attributes;
    const country = record[Properties.Country];
    const province = record[Properties.Province] ?? "";
    const lat = record[Properties.Lat] ?? 0;
    const long = record[Properties.Long] ?? 0;
    const confirmed = record[Properties.Confirmed];
    const recovered = record[Properties.Recovered];
    const deaths = record[Properties.Deaths];
    const active = confirmed - (recovered + deaths);
    const lastUpdate = record[Properties.LastUpdate];
    const perCapita = record[Properties.PerCapita] ?? 0;

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
        perCapita,
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
        perCapita: a.latest.perCapita + b.latest.perCapita,
        lastUpdate: Math.max(a.latest.lastUpdate,  b.latest.lastUpdate),
      }
    }
  });

  const mergedDict = { global, ...province, ...country };
  return mergedDict;
}


const getQuebecCases = async () => {
  const url = `${baseUrl}/3/query?f=json&returnGeometry=false&where=Province_State%20%3D%20%27Quebec%27&outFields=Confirmed`
  const response: any = await got(url, {headers}).json();
  const confirmed = response.features[0].attributes.Confirmed;
  return confirmed;
}

const getCanadaCases = async () => {
  const url = `${baseUrl}/2/query?f=json&returnGeometry=false&where=Country_Region%20%3D%20%27Canada%27&outFields=Confirmed`
  const response: any = await got(url, {headers}).json();
  const confirmed = response.features[0].attributes.Confirmed;
  return confirmed;
}

export { getLatest, getQuebecCases, getCanadaCases };
