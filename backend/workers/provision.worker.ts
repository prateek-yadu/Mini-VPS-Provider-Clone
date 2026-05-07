import { config } from "dotenv";
import { Job, Worker } from "bullmq";
// @ts-ignore
import { redisConnection } from "../lib/redis.ts";
import { Redis } from "ioredis";

config({ path: "../.env" });

// new redis instance
const redis = new Redis();

var iscrashed = false;

const worker = new Worker(
  process.env.REDIS_PROVISIONING_QUEUE || "provision-instance",
  async (job: Job) => {
    try {
      // will call lxd api to creare instance
      const createInstance: any = await (
        await fetch(`${process.env.LXD_AGENT_SERVER}/api/v1/instance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job.data),
        })
      ).json();

      if (createInstance.status !== 200) {
        throw new Error("Instance creation failed");
      }
    } catch (error: any) {
      throw new Error("Instance creation failed, Reason:", error);
    }
  },
  redisConnection,
);

worker.on("ready", () => {
  iscrashed = false;
});

worker.on("error", () => {
  console.log("DOWN");
  iscrashed = true;
});

setInterval(() => {
  const payload = {
    status: iscrashed ? "DOWN" : "OK",
    lastCheck: Date.now(),
  };
  redis.set(
    "health:workers:provision-worker",
    JSON.stringify(payload),
    "EX",
    15,
  );
}, 5000);
