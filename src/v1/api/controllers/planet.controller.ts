import { NextFunction, Request, Response } from 'express';
import { response, updatePlanetRequest } from '@/v1/api/dtos';
import { Planet } from '@/v1/domain/entity/planet';
import { validationResult } from 'express-validator';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { BusinessError } from '@/v1/domain/errors';
import { updatePlanetValidator } from '@/v1/api/validators';

export class PlanetController {
  constructor(readonly planetService: PlanetService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { name, climate, terrain, population } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return next(new BusinessError(errorMessages.toString()));
    }

    try {
      const planet = new Planet(name, climate, terrain, population);
      await this.planetService.create(planet);

      const status: number = 201;
      const message: string = 'Planet successfully saved!';
      const response: response = { status, message };

      res.status(status).json(response);
    }catch (error){
      return next(error)
    }
  }

  readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await this.planetService.readAll()

      const status: number = 200;
      const message: string = 'OK';
      const response: response = { status, message, body };

      res.status(status).json(response);
    }catch (error){
      return next(error)
    }
  }

  readById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } =  req.params
    try {
      const body = await this.planetService.readById(id)

      const status: number = 200;
      const message: string = 'OK';
      const response: response = { status, message, body };

      res.status(status).json(response);
      }catch (error){
        next(error)
      }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } =  req.params
    const { name, climate, terrain, population } = req.body;

    const errorMessage = updatePlanetValidator({name,climate,terrain,population})
    if (errorMessage) return next(new BusinessError(errorMessage as string))

    try {
      const planet = new Planet(name, climate, terrain, population);
      planet.id = id

      await this.planetService.update(planet)
    }catch (error){
      next(error)
    }
  }
}
