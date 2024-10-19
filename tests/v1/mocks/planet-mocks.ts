import {faker} from "@faker-js/faker";
import { Planet } from '@/v1/domain/entity/planet';

export const planetFactory: Planet = new Planet(
    faker.lorem.word(),
    faker.lorem.word(),
    faker.lorem.word(),
    faker.number.int())