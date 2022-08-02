import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { getDb } from "../db";

const signup: RequestHandler = async (req, res) => {
  const db = await getDb();

  const { name, password } = req.body;

  const user = await db.collection("users").findOne({ name });

  if (user) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const newUser = await db.collection("users").insertOne({
    name,
    password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT!)),
  });

  //@ts-ignore
  req.session.name = name;

  res.status(200).json({ success: "User created" });
};

export default signup;
