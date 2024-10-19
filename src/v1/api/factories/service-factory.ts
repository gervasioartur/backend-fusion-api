import { PlanetService } from '@/v1/services/contract/planet.service';
import { PlanetServiceImpl } from '@/v1/services/impl/planet.service.impl';
import { makePlanetRepository } from '@/v1/api/factories/repository-factory';

export const makePlanetService = (): PlanetService => {
  return new PlanetServiceImpl(makePlanetRepository())
}