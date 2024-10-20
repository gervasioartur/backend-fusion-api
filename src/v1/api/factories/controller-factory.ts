import { makePlanetService } from '@/v1/api/factories/service-factory';
import { PlanetController } from '@/v1/api/controllers/planet.controller';

export const makePlanetController = (): PlanetController => {
  return  new PlanetController(makePlanetService())
}