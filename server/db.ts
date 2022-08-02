import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);

export const getDb = async () => {
  await client.connect();
  return client.db("home");
};
