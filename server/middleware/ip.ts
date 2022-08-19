import type { Handler } from "express";

const ip: Handler = async (req, res, next) => {
  console.log("IP: " + req.ip + req.ips);
  next();
};

export default ip;
