import { NowRequest, NowResponse } from "@now/node";
import  { getAll } from "../services/jhu";

export default async (req: NowRequest, res: NowResponse) => {
  const result = await getAll();
  res.json(result);
}
