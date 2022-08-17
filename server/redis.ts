import { createClient } from "redis";
import { getDb } from "./db";

//@
const redisClient = createClient();

redisClient.on("connect", () => {
  console.log("Connected to redis. Running full bitfield build from mongo");
  buildFromMongo();
});

export const getRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

// TODO: Finish this
const buildFromMongo = async () => {
  console.log("Beginning redis build from mongo at " + new Date());
  const db = await getDb();

  const cursor = db.collection("pixels").find({});

  await redisClient.sendCommand([
    "BITFIELD",
    process.env.REDIS_KEY!,
    "SET",
    "u2",
    // 512x512 pixels, 2 pixels per byte
    ((512 * 512) / 2 - 1).toString(),
    "0",
  ]);

  for await (const pixel of cursor) {
    console.log("Pixel: " + JSON.stringify(pixel));
    console.log(pixel._id.toString(), pixel.color);
    //await redisClient.sendCommand(["BITFIELD", process.env.REDIS_KEY!, ""]);
  }
};
