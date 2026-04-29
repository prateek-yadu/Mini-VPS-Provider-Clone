import { Queue } from "bullmq";
import { instanceData } from "../../interface/InstanceData.js";
import { connection } from "../queue.config.js";

// creates new queue
const queue = new Queue(process.env.REDIS_PROVISIONING_QUEUE || 'provision-instance', connection);

// init queue
export const provisioningQueue = async (instance: instanceData) => {
    let res = await queue.add(`create-instance-${instance.id}`, instance, {
        removeOnComplete: true
    });

    return res.getState();
};