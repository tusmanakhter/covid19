import cache from "../helpers/cache";
import  { getHistoryData } from "../services/canada";
import { getCanadaCases as getCanadaCasesJhu } from "../services/jhu-esri";

const getCanadaCases = async (): Promise<number> => {
  let canadaCases: number = cache.get("canadaCases");
  if ( canadaCases === undefined ) {
    const canadaCasesJHU: number = await getCanadaCasesJhu();
    const canadaCAData: any = await getHistoryData();
    const canadaCasesCA: number = canadaCAData['Canada'].pop().confirmed;

    if (canadaCasesJHU !== undefined && canadaCasesCA !== undefined) {
      canadaCases = Math.max(canadaCasesCA, canadaCasesJHU);
    } else if (canadaCasesJHU === undefined) {
      canadaCases = canadaCasesCA;
    } else if (canadaCasesCA === undefined) {
      canadaCases = canadaCasesJHU;
    } else {
      canadaCases = 0;
    }

    cache.set("canadaCases", canadaCases, 60);
  }
  return canadaCases;
}

export { getCanadaCases };
