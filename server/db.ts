import { MongoClient, ServerApiVersion } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI!);

mongoClient.on("connect", () => {
  console.log("Connected to mongo");
});

export const getDb = async () => {
  await mongoClient.connect();
  return mongoClient.db("home");
};
