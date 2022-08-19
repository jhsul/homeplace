import { createClient } from "redis";
import { getDb } from "./db";

//@
const redisClient = createClient();

redisClient.on("connect", () => {
  //console.log("Connected to redis. Running full bitfield build from mongo");
  //buildFromMongo();
});

export const getRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

export const buildFromMongo = async () => {
  console.log("Beginning redis build from mongo at " + new Date());
  const db = await getDb();

  const cursor = db
    .collection("pixels")
    .find({}, { projection: { history: 0 } });

  await redisClient.sendCommand([
    "BITFIELD",
    process.env.REDIS_KEY!,
    "SET",
    "u4",
    // 512x512 pixels, 2 pixels per byte
    `#${(512 * 512 - 1).toString()}`,
    "3",
  ]);

  for await (const pixel of cursor) {
    console.log("Pixel: " + JSON.stringify(pixel));
    console.log(pixel._id.toString(), pixel.color);

    const [x, y] = pixel._id
      .toString()
      .split(",")
      .map((s) => parseInt(s));

    const redisCommand = [
      "BITFIELD",
      process.env.REDIS_KEY!,
      "SET",
      "u4",
      `#${x + y * 512}`,
      `${pixel.color}`,
    ];
    console.log(redisCommand);
    await redisClient.sendCommand(redisCommand);
  }
  return redisClient;
};
