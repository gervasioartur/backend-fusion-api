import { ConflictError, NotFoundError, UnexpectedError } from '@/v1/domain/errors';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/v1/middleware/error-handler';

describe('basicTest middleware', () => {
  let req: Partial<Request>;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });

  it('should handle NotFoundError and return 404 status', () => {
    const notFoundError = new NotFoundError();
    errorHandler(notFoundError, req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'NotFoundError',
      body: 'Resource not found',
    });
  });

  it('should handle ConflictError and return 409 status', () => {
    const conflictError = new ConflictError('Resource conflict');
    errorHandler(conflictError, req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      status: 409,
      message: 'ConflictError',
      body: 'Resource conflict',
    });
  });

  it('should handle UnexpectError and return 500 status', () => {
    const unexpectError = new UnexpectedError('Unexpected error occurred');
    errorHandler(unexpectError, req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'UnexpectedError',
      body: 'Unexpected error occurred',
    });
  });

  it('should handle unknown error and return 500 status', () => {
    const unknownError = new Error('Some unknown error');
    errorHandler(unknownError, req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'InternalServerError',
      body: 'Some unknown error',
    });
  });
});
