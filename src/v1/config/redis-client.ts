import { createClient } from 'redis';
import * as dotenv from "dotenv";

dotenv.config();
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
const redisClient = createClient({url})
export  default  redisClient