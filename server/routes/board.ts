import { RequestHandler } from "express";
import { commandOptions } from "redis";
import { getRedis } from "../redis";

const board: RequestHandler = async (req, res) => {
  console.log("Board requested");
  const redis = await getRedis();

  const board = await redis.get(
    commandOptions({ returnBuffers: true }),
    process.env.REDIS_KEY!
  );
  console.log("Board: " + board);
  //console.log(Buffer.from(board));
  res.status(200).end(board);
};

export default board;
