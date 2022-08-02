import { RequestHandler } from "express";

const logout: RequestHandler = async (req, res) => {
  //@ts-ignore
  if (!req.session.name) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }

  //@ts-ignore
  console.log(`Logging out ${req.session.name}`);

  req.session.destroy((err) => {
    console.error(err);
  });
  res.status(200).json({ success: "Logout successful" });
};
