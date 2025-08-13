import {createClient} from "redis";
import { envConfig } from "./envConfig.js";

const redisClient = createClient({
    url: envConfig.redis_url || 'redis://localhost:6379'
})


redisClient.on('error',(err) => console.error('Redis Client Error',err))


export default redisClient;