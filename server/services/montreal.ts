import { getQuebecCases, getCanadaCases } from "./jhu-esri";
import  { getMontrealData } from "../services/sante-montreal";
import cache from "../helpers/cache";

const getData = async () => {
  let montrealData: any = cache.get("montreal");
  if ( montrealData === undefined ) {
    let quebecCases = cache.get("quebecCases");
    if ( quebecCases === undefined ) {
      quebecCases = await getQuebecCases();
      cache.set("quebecCases", quebecCases, 60);
    }

    let canadaCases = cache.get("canadaCases");
    if ( canadaCases === undefined ) {
      canadaCases = await getCanadaCases();
      cache.set("canadaCases", canadaCases, 60);
    }

    let montrealRegionData: any = cache.get("montrealRegionData");
    if ( montrealRegionData === undefined ) {
      montrealRegionData = await getMontrealData();
      cache.set("montrealRegionData", montrealRegionData, 600);
    }

    montrealData = {
      quebecCases,
      canadaCases,
      ...montrealRegionData,
    };

    cache.set("montreal", montrealData, 60);
  }

  return montrealData;
}

export { getData };
