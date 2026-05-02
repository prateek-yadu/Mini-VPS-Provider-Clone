import { Request, Response } from "express";

export const shallowHealth = (req: Request, res: Response) => {
  const health = {
    health: "OK",
    uptime: process.uptime(), // sends uptime in seconds
    lastCheck: Date.now(),
    timeStamp: Date.now(),
  };
  res.json(health)
};