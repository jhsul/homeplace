import type { Handler } from "express";

import { getDb } from "../db";
import { getRedis } from "../redis";

const stores: Handler = async (req, res, next) => {
  //@ts-ignore
  req.db = await getDb();

  //@ts-ignore
  req.redis = await getRedis();
  next();
};

export default stores;
