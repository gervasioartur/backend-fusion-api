import { PlanetController } from '@/v1/api/controller/planet.controller';
import { makePlanetService } from '@/v1/api/factories/service-factory';

export const makePlanetController = (): PlanetController => {
  return  new PlanetController(makePlanetService())
}