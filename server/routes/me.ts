import { RequestHandler } from "express";

const me: RequestHandler = (req, res) => {
  //@ts-ignore
  res.status(200).json({ username: req.session.username });
  return;
};

export default me;
