import { getLatest } from "./jhu-esri";
import { getAllCategories } from "./jsu-github";
import cache from "../helpers/cache";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const getAll = async () => {
  let finalData: any = cache.get("all");
  if ( finalData === undefined ) {

    let latest = cache.get("latest");
    if ( latest === undefined ) {
      latest = await getLatest();
      cache.set("latest", latest, 60);
    }

    let history = cache.get("history");
    if ( history === undefined ) {
      history = await getAllCategories();
      cache.set("history", history, 600);
    }

    finalData = {};
    finalData.locations = {};

    const historyKeys = Object.keys(history);
    for (const historyKey of historyKeys) {
      const key = historyKey;
      const historyData = history[key];
      let latestData = latest[key];

      if (!latestData) {
        latestData = {
          latest: {
            confirmed: 0,
            recovered: 0,
            deaths: 0,
            active: 0,
            perCapita: 0,
            lastUpdate: 0
          }
        }
      }

      const result = {
        ...historyData,
        ...latestData
      }

      const date = dayjs.utc().format("M/D/YY");
      const latestHistoryItem = {
        date,
        ...latestData.latest,
      }
      result.history.push(latestHistoryItem);

      if (key === "global") {
        const global = {
          ...result,
          location: {
            country: "Global",
            province: "",
            lat: 25,
            long: 10,
          },
        }
        finalData.global = global;
      } else {
        finalData.locations[key]= result;
      }
    }
    cache.set("all", finalData, 60);
  }

  return finalData;
}

export { getAll };
