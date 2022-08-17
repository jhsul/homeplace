import type { Handler } from "express";
const auth: Handler = async (req, res, next) => {
  //@ts-ignore
  if (!req.session.username) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
};

export default auth;
