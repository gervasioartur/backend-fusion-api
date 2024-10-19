import { NextFunction, Request, Response } from 'express';
import { BusinessError, ConflictError, NotFoundError, UnexpectedError } from '@/v1/domain/errors';
import { response } from '@/v1/api/dtos';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let responseError: response;

  switch (true) {
    case error instanceof BusinessError:
      responseError = {
        status: 400,
        message: 'BusinessError',
        body: error.message,
      };
      break;
    case error instanceof NotFoundError:
      responseError = {
        status: 404,
        message: 'NotFoundError',
        body: error.message,
      };
      break;
    case error instanceof ConflictError:
      responseError = {
        status: 409,
        message: 'ConflictError',
        body: error.message,
      };
      break;
    case error instanceof UnexpectedError:
      responseError = {
        status: 500,
        message: 'UnexpectedError',
        body: error.message,
      };
      break;
    default:
      responseError = {
        status: 500,
        message: 'InternalServerError',
        body: error.message,
      };
  }

  res.status(responseError.status).json(responseError);
};
