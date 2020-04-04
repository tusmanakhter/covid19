import { NowRequest, NowResponse } from "@now/node";
import  { getData } from "../../services/montreal";

export default async (req: NowRequest, res: NowResponse) => {
  const result = await getData();
  res.json(result);
}
