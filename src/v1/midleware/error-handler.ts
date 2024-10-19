import { NextFunction,Request, Response } from 'express';
import { ConflictError, UnexpectError } from '@/v1/domain/errors';

export const errorHandler = (error: any, req: Request,res: Response, next: NextFunction) => {
  let statusCode: number
  let message: string

  switch (true){
    case error instanceof ConflictError:
      statusCode =  409
      message =  error.message
      break;
    case error instanceof UnexpectError:
      statusCode = 500;
      message = 'An unexpected error occurred'
      break;
    default:
      statusCode =  500;
      message = 'An unexpected error occurred'
  }

  res.status(statusCode).json({message})
}