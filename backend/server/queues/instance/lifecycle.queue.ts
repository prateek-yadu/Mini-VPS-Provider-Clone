import { Queue } from "bullmq";
import { connection } from "../queue.config.js";
import { lifecycleQueueData } from "../../types/lifecycleQueueData.js";

// creates new queue
const queue = new Queue("instance-lifecycle", connection);

// init queue
export const lifecycleQueue = async (instance: lifecycleQueueData) => {
    let res = await queue.add(`instance-operation-${instance.name}`, instance, {
        removeOnComplete: true,
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000
        }
    });

    return res.getState();
};