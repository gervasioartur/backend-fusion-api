import {faker} from "@faker-js/faker";
import { Planet } from '@/v1/domain/entity/planet';
import { createPlanetRequest } from '@/v1/api/dtos';

export const planetWithNoIdFactory: Planet = new Planet(
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.number.int())

export const planetWithIdFromPlanetFactory = (planet: Planet): Planet => {
  planet.id = faker.database.mongodbObjectId()
  return planet
}

export const planetWithIdFactory = ():Planet => {
  const planet =  new Planet(
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.number.int())

  planet.id = faker.database.mongodbObjectId()
  return planet
}

export const planetsWithNoIdFactory = ():Planet[] => {
  const planetFactoryOne: Planet = {
    ...planetWithNoIdFactory,
    name: faker.lorem.word(),
    active: true,
  }

  const planetFactoryTwo = {
    ...planetWithNoIdFactory,
    name: faker.lorem.word(),
    active: true,
  }

  return [planetFactoryOne, planetFactoryTwo]
}

export const planetsWithIdFactory = ():Planet[] => {
  const planetFactoryOne: Planet = {
    ...planetWithIdFactory(),
    name: faker.lorem.word(),
    active: true,
  }

  const planetFactoryTwo = {
    ...planetWithIdFactory(),
    name: faker.lorem.word(),
    active: true,
  }
  return [planetFactoryOne, planetFactoryTwo]
}

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