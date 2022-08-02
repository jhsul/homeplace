import { RequestHandler } from "express";

const me: RequestHandler = (req, res) => {
  //@ts-ignore
  if (!req.session.name) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  //@ts-ignore
  res.status(200).json({ name: req.session.name });
  return;
};

export default me;
