import { createClient } from 'redis';
import * as dotenv from "dotenv";

dotenv.config();
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
console.log(url)
const redisClient = createClient({url})
redisClient.on('error', (error) => console.log('Redis client Error: ', error))
redisClient.connect();
export  default  redisClient