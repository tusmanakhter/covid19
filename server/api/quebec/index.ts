import { NowRequest, NowResponse } from "@now/node";
import  { getQuebecData } from "../../services/quebec";

export default async (req: NowRequest, res: NowResponse) => {
  const result = await getQuebecData();
  res.json(result);
}
