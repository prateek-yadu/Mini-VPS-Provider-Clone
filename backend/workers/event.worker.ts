import { config } from "dotenv";
import { Redis } from "ioredis";
// @ts-ignore
import { pool } from "../lib/db.ts";

// dotenv config
config({ path: "../.env" });

// creates socket connection
const socket = new WebSocket(`${process.env.LXD_SERVER}/1.0/events?type=${process.env.LXD_EVENTS}&project=${process.env.PROJECT}`);
const redis = new Redis();

socket.addEventListener('open', () => {
    console.log("listening for socket connection...");
});


socket.addEventListener('message', async (event) => {
    try {
        const message = JSON.parse(event.data);

        const project = message.metadata.project; // gets project name
        const instance = message.metadata.name; // gets instance name
        const operation = message.metadata.action; // gets operation eg.instance-shutdown, instance-started

        // verifies if project matches the project in dotenv
        if (project === process.env.PROJECT) {

            // update state in db
            switch (operation) {
                case "instance-started":
                case "instance-restarted":
                    const [setStatusToRunning]: any = await pool.query('UPDATE instances SET status=? WHERE id=?', ["running", instance]);
                    break;
                case "instance-shutdown":
                case "instance-stopped":
                    const [setStatusToStopped]: any = await pool.query('UPDATE instances SET status=? WHERE id=?', ["stopped", instance]);
                    break;
            }

            // sends to redis pub/sub
            redis.publish(process.env.REDIS_PUBSUB_INSTANCE_EVENT_CHANNEL || 'instance-events', JSON.stringify({
                instance,
                operation
            }));
        }
    } catch (error) {
        // logs error - # TODO
    }
});


socket.addEventListener('error', () => {
    // logs error - # TODO
});


socket.addEventListener('close', () => {
    console.log("connection closed by server");
});