import { RequestHandler } from "express";

const logout: RequestHandler = async (req, res) => {
  //@ts-ignore
  console.log(`Logging out ${req.session.username}`);

  req.session.destroy((err) => {
    //console.error(err);
  });
  res.status(200).json({ success: "Logout successful" });
};

export default logout;
