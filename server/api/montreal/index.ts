import { NowRequest, NowResponse } from "@now/node";
import  { getMontrealData } from "../../services/sante-montreal";

export default async (req: NowRequest, res: NowResponse) => {
  const result = await getMontrealData();
  res.json(result);
}
