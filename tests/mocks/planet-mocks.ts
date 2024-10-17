import {CreatePlanetRequest} from "@/dto/CreatePlanetRequest";
import {faker} from "@faker-js/faker";

export const planetFactory: CreatePlanetRequest = {
    name: faker.lorem.word(),
    climate: faker.lorem.word(),
    terrain: faker.lorem.word(),
    population: faker.number.int(),
}