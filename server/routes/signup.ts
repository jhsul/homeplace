import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db";

const signup: RequestHandler = async (req, res) => {
  const db = await getDb();

  const { username, password } = req.body;

  const user = await db.collection("users").findOne({ username });

  if (user) {
    res.status(400).json({ error: "Username taken" });
    return;
  }

  await db.collection("users").insertOne({
    username,
    password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT!)),
    latest: 0,
    history: [],
  });

  //@ts-ignore
  req.session.username = username;

  res.status(200).json({ success: "User created" });
};

export default signup;
