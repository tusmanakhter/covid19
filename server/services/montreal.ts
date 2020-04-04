import { getQuebecCases, getCanadaCases } from "./jhu-esri";
import  { getMontrealData, getMontrealAgeData } from "../services/sante-montreal";
import  { getHistoryData } from "../services/canada";
import  { getConfirmedData } from "../services/quebec";
import cache from "../helpers/cache";

const getData = async () => {
  let montrealData: any = cache.get("montreal");
  if ( montrealData === undefined ) {
    let quebecCases = cache.get("quebecCases");
    if ( quebecCases === undefined ) {
      const quebecCasesJHU = await getQuebecCases();
      const quebecCAData: any = await getConfirmedData();
      const quebecCasesCA = quebecCAData.data.pop().confirmed;
      quebecCases = Math.max(quebecCasesCA, quebecCasesJHU);
      cache.set("quebecCases", quebecCases, 60);
    }

    let canadaCases = cache.get("canadaCases");
    if ( canadaCases === undefined ) {
      const canadaCasesJHU = await getCanadaCases();
      const canadaCAData: any = await getHistoryData();
      const canadaCasesCA = canadaCAData['Canada'].pop().confirmed;
      canadaCases = Math.max(canadaCasesCA, canadaCasesJHU);
      cache.set("canadaCases", canadaCases, 60);
    }

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
      ...montrealRegionData,
      ages: montrealAgeData,
    };

    cache.set("montreal", montrealData, 60);
  }

  return montrealData;
}

export { getData };
