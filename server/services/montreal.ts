import { getQuebecCases } from "./jhu-esri";
import { getCanadaCases } from "../helpers/cases";
import  { getMontrealData, getMontrealAgeData } from "../services/sante-montreal";
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

      if (quebecCasesJHU !== undefined && quebecCasesCA !== undefined) {
        quebecCases = Math.max(quebecCasesCA, quebecCasesJHU);
      } else if (quebecCasesJHU === undefined) {
        quebecCases = quebecCasesCA;
      } else if (quebecCasesCA === undefined) {
        quebecCases = quebecCasesJHU;
      } else {
        quebecCases = 0;
      }

      cache.set("quebecCases", quebecCases, 60);
    }

    const canadaCases = await getCanadaCases();

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
