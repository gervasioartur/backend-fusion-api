
import { makePlanetRepository } from '@/v1/api/factories/repository-factory';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { PlanetServiceImpl } from '@/v1/service/impl/planet.service.impl';

export const makePlanetService = (): PlanetService => {
  return new PlanetServiceImpl(makePlanetRepository())
}