import { NowRequest, NowResponse } from "@now/node";
import geojson from '../../helpers/montreal-geojson';

export default async (req: NowRequest, res: NowResponse) => {
  res.json(geojson);
}
