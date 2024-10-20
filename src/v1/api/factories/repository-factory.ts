import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import { PlanetRepositoryImpl } from '@/v1/persistence/repository/impl/planet.repository.impl';
import { Planet } from '@/v1/domain/entity/planet';
import { dataSource } from '@/v1/persistence/data-source';

export const makePlanetRepository = (): PlanetRepository => {
  return new PlanetRepositoryImpl(Planet, dataSource.createEntityManager())
}