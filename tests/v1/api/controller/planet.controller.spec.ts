import { PlanetService } from '@/v1/services/contract/planet.service';
import { PlanetController } from '@/v1/api/controller/planet.controller';
import { createPlanetRequest } from '@/v1/api/dtos';
import { NextFunction, Request, Response } from 'express';
import { UnexpectError } from '@/v1/domain/errors';
import { errorHandler } from '@/v1/api/midleware/errorHandler';

const mockPlanetService = { create: jest.fn()} as unknown as PlanetService

describe('PlanetController', () => {
  let planetController: PlanetController
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    planetController = new PlanetController(mockPlanetService)

    req = {
      body: {
        name: 'Tatooine',
        climate: 'arid',
        terrain: 'desert',
        population: 200000
      } as createPlanetRequest
    } as Request;

    jsonMock =  jest.fn()
    statusMock =  jest.fn().mockReturnValue({json: jsonMock})

    res = { status: statusMock} as Partial<Response>
    next =  jest.fn()
  })

  it('Should return 500 if unexpectError is thrown', async () => {
    const error = new UnexpectError('An unexpected error occurred while trying save planet info.')
    errorHandler(error, req as Request, res as Response, next);
    await planetController.create(req as Request, res as Response,next)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})