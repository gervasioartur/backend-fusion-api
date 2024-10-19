import { Request, Response, NextFunction } from 'express';
import { ConflictError, UnexpectError } from '@/v1/domain/errors';
import { errorHandler } from '@/v1/midleware/error-handler';

describe('Error Handler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 409 for ConflictError', () => {
    const error = new ConflictError('Conflict occurred');
    errorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Conflict occurred' });
  });

  it('should return 500 for UnexpectError', () => {
    const error = new UnexpectError('An unexpected error occurred');
    errorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
  });

  it('should return 500 for unknown errors', () => {
    const error = new Error('Some unknown error');
    errorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
  });
});
