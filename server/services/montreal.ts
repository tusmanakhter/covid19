import { getCanadaStats, getQuebecStats } from "../helpers/stats";
import  { getMontrealData, getMontrealAgeData } from "../services/sante-montreal";
import cache from "../helpers/cache";

const getData = async () => {
  let montrealData: any = cache.get("montreal");
  if ( montrealData === undefined ) {
    const quebecStats = await getQuebecStats();
    const canadaStats = await getCanadaStats();

    const quebecCases = quebecStats.cases;
    const canadaCases = canadaStats.cases;
    const quebecDeaths = quebecStats.deaths;
    const canadaDeaths = canadaStats.deaths;

    let montrealRegionData: any = cache.get("montrealRegionData");
    if ( montrealRegionData === undefined ) {
      montrealRegionData = await getMontrealData();
      cache.set("montrealRegionData", montrealRegionData, 600);
    }

    let montrealAgeData: any = cache.get("montrealAgeData");
    if ( montrealAgeData === undefined ) {
      montrealAgeData = await getMontrealAgeData();
      cache.set("montrealAgeData", montrealAgeData, 600);
    }

    montrealData = {
      quebecCases,
      canadaCases,
      quebecDeaths,
      canadaDeaths,
      ...montrealRegionData,
      ages: montrealAgeData,
    };

    cache.set("montreal", montrealData, 60);
  }

  return montrealData;
}

export { getData };
