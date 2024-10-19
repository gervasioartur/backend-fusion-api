import { Request, Response } from 'express';
import { PlanetService } from '@/v1/services/contract/planet.service';
import { createPlanetRequest, response } from '@/v1/api/dtos';
import { Planet } from '@/v1/domain/entity/planet';
import { asyncHandler } from '@/v1/api/midleware/asyncHandler';

export class PlanetController {
  constructor(readonly planetService: PlanetService) {
  }

  create = asyncHandler(async (req: Request<{}, {}, createPlanetRequest>, res: Response) => {
    const { name, climate, terrain, population } = req.body;
    const planet = new Planet(name,climate,terrain,population);
    await this.planetService.create(planet)

    const status: number = 201
    const message: string = 'Planet successfully saved!'
    const response : response = {status,message}

    res.status(status).json(response)
  })
}