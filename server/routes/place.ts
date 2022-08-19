import { RequestHandler } from "express";
import { getDb } from "../db";
import { getRedis } from "../redis";
import { broadcast } from "../main";
import type { User } from "../models";
import { Db } from "mongodb";
import { RedisClientType } from "@redis/client";

const place: RequestHandler = (req, res) => {
  const { x, y, color } = req.body;

  // Catch bad input(s)
  if (x == null || y == null || color == null) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  if (isNaN(parseInt(x)) || isNaN(parseInt(y)) || isNaN(parseInt(color))) {
    res.status(400).json({ error: "Integers only" });
    return;
  }

  if (x < 0 || x >= process.env.WIDTH! || y < 0 || y >= process.env.HEIGHT!) {
    res.status(400).json({ error: "Invalid coordinates" });
    return;
  }

  if (color < 0 || color >= 16) {
    res.status(400).json({ error: "Invalid color" });
    return;
  }

  //@ts-ignore
  const db = req.db as Db;

  //@ts-ignore
  const redis = req.redis as RedisClientType;

  //@ts-ignore
  const username = req.session.username as string;

  console.log({ username, x, y, color });

  // Immediately update websocket clients
  broadcast({ type: "placement", data: { x, y, color } });

  // Then update redis

  const redisArgs = [
    "BITFIELD",
    process.env.REDIS_KEY!,
    "SET",
    "u4",
    `#${(x + 512 * y).toString()}`,
    color.toString(),
  ];

  //console.log("Redis args: " + redisArgs);
  redis.sendCommand(redisArgs);

  // Finally, update database
  db.collection("pixels").updateOne(
    {
      _id: `${x},${y}`,
    },
    {
      //@ts-ignore
      $set: { color, author: req.session.username },
    },
    { upsert: true }
  );

  //@ts-ignore
  res.status(200).json({ success: "Pixel placed" });
  return;
};

export default place;
