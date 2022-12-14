import { RequestHandler } from "express";
import bcrypt from "bcryptjs";

import { getDb } from "../db";

const login: RequestHandler = async (req, res) => {
  const db = await getDb();

  const { username, password } = req.body;

  const user = await db.collection("users").findOne({ username });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ error: "Invalid password" });
    return;
  }

  //@ts-ignore
  req.session.username = username;

  res.status(200).json({ success: "Login successful" });
  return;
};

export default login;
