import { NextFunction, Request, Response } from 'express';
import redisClient from '@/v1/config/redis-client';

const cacheMiddleware = (cacheName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheData =  await redisClient.get(cacheName)
      if (cacheData) return res.json(JSON.parse(cacheData))
      next()
    }catch (error){
      next(error)
    }
  }
}

export  default cacheMiddleware