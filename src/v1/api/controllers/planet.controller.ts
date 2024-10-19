import { Request, Response } from 'express';
import { createPlanetRequest, response } from '@/v1/api/dtos';
import { Planet } from '@/v1/domain/entity/planet';
import { asyncHandler } from '@/v1/midleware/async-handler';
import { validationResult } from 'express-validator';
import { PlanetService } from '@/v1/service/contract/planet.service';

export class PlanetController {
  constructor(readonly planetService: PlanetService) {
  }

  create = asyncHandler(async (req: Request<{}, {}, createPlanetRequest>, res: Response) => {
    const { name, climate, terrain, population } = req.body;

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      const responseError: response = {
        status: 400,
        message: "Validation Error",
        body: errorMessages
      }
      res.status(400).json(responseError);
      return
    }

    const planet = new Planet(name,climate,terrain,population);
    await this.planetService.create(planet)

    const status: number = 201
    const message: string = 'Planet successfully saved!'
    const response : response = {status,message}

    res.status(status).json(response)
  })
}