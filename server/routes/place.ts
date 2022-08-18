import { RequestHandler } from "express";
import { getDb } from "../db";
import { getRedis } from "../redis";
import { broadcast } from "../main";
import type { User } from "../models";

const place: RequestHandler = async (req, res) => {
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

  const db = await getDb();
  const redis = await getRedis();

  const user = (await db
    .collection("users")
    //@ts-ignore
    .findOne({ username: req.session.username })) as User;

  if (
    Date.now() - new Date(user.latest).getDate() <
    parseInt(process.env.DELAY!)
  ) {
    res.status(400).json({ error: "You're too fast" });
    return;
  }

  // At this point, we can place the pixel. Notice the priority ahead!

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

  console.log("Redis args: " + redisArgs);
  await redis.sendCommand(redisArgs);

  // Finally, update database
  const { insertedId } = await db.collection("history").insertOne({
    x,
    y,
    color,
    //@ts-ignore
    username: req.session.username,
    date: Date.now(),
  });

  await db.collection("users").updateOne(
    //@ts-ignore
    { username: req.session.username },
    { $inc: { pixels: -1 }, $push: { history: insertedId } }
  );

  await db.collection("pixels").updateOne(
    {
      _id: `${x},${y}`,
    },
    {
      $set: { color },
      $push: { history: insertedId },
    },
    { upsert: true }
  );

  //@ts-ignore
  res.status(200).json({ success: "Pixel placed" });
  return;
};

export default place;
