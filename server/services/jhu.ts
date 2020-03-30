import { getLatest } from "./jhu-esri";
import { getAllCategories } from "./jsu-github";
import cache from "../helpers/cache";

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
            lastUpdate: 0
          }
        }
      }

      const result = {
        ...historyData,
        ...latestData
      }

      if (key === "global") {
        const global = {
          ...result,
          location: {
            country: "Global",
            province: "",
            lat: 35,
            long: 6,
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
