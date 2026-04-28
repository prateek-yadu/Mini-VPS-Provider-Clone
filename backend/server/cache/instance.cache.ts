import { Redis } from "ioredis"
import { pool } from "../../lib/db.js"

const redis = new Redis()
const pipeline = redis.pipeline()


export const cacheInstances = async (userId: string) => {
    const [instances]: any = await pool.query("SELECT id FROM instances WHERE user_id=?", [userId])


    // if instnace is present add to cache
    if (instances.length !== 0) {
        for (const instance of instances) {
            pipeline.set(`instance-cache:${instance.id}`, userId)
        }
        pipeline.exec();
    }

}