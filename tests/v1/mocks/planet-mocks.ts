import {faker} from "@faker-js/faker";
import { Planet } from '@/v1/domain/entity/planet';
import { createPlanetRequest } from '@/v1/api/dtos';

export const planetFactory: Planet = new Planet(
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.number.int())

export const createPlanetRequestFactory = (): createPlanetRequest => {
  return {
    name: faker.lorem.word(),
    climate: faker.lorem.word(),
    terrain: faker.lorem.word(),
    population: faker.number.int(),
  };
};

export const createPlanetFromDtoFactory = (requestParams: createPlanetRequest): Planet => {
  return new Planet(requestParams.name,requestParams.climate,requestParams.terrain,requestParams.population);
}