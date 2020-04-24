import cache from "./cache";
import  { getHistoryData } from "../services/canada";
import  { getDateData } from "../services/quebec";
import { getCanadaStats as getCanadaStatsJhu, getQuebecStats as getQuebecStatsJhu } from "../services/jhu-esri";

const getCanadaStats = async (): Promise<IStats> => {
  let stats: IStats = cache.get("canadaStats");
  if ( stats === undefined ) {
    const canadaCAData: any = await getHistoryData();
    const canadaJHUData: any = await getCanadaStatsJhu();
    const canadaLatestCA: any = canadaCAData['Canada'].pop();
    const canadaCasesJHU: number = canadaJHUData.confirmed;
    const canadaCasesCA: number = canadaLatestCA.confirmed;
    const canadaDeathsJHU: number = canadaJHUData.deaths;
    const canadaDeathsCA: number = canadaLatestCA.deaths;

    const cases = getStat(canadaCasesJHU, canadaCasesCA);
    const deaths = getStat(canadaDeathsJHU, canadaDeathsCA)
    stats = { cases, deaths };

    cache.set("canadaStats", stats, 60);
  }
  
  return stats;
}

const getQuebecStats = async (): Promise<IStats> => {
  let stats: IStats = cache.get("quebecStats");
  if ( stats === undefined ) {
    const quebecCAData: any = await getDateData();
    const quebecJHUData: any = await getQuebecStatsJhu();
    const quebecLatestCA: any = quebecCAData.pop().confirmed;
    const quebecCasesJHU: number = quebecJHUData.confirmed;
    const quebecCasesCA: number = quebecLatestCA.confirmed;
    const quebecDeathsJHU: number = quebecJHUData.deaths;
    const quebecDeathsCA: number = quebecLatestCA.deaths;

    const cases = getStat(quebecCasesJHU, quebecCasesCA);
    const deaths = getStat(quebecDeathsJHU, quebecDeathsCA)
    stats = { cases, deaths };

    cache.set("quebecStats", stats, 60);
  }
  
  return stats;
}

const getStat = (jhu: number, ca: number) => {
  let stat: number;
  if (jhu !== undefined && ca !== undefined) {
    stat = Math.max(jhu, ca);
  } else if (jhu === undefined) {
    stat = ca;
  } else if (ca === undefined) {
    stat = jhu;
  } else {
    stat = 0;
  }
  return stat;
}

interface IStats {
  cases: number;
  deaths: number;
}

export { getCanadaStats, getQuebecStats };
