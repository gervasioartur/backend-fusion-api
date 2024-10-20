import { mock,Mock } from 'ts-jest-mocker';
import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import { planetWithNoIdFactory, planetsWithIdFactory, planetWithIdFromPlanetFactory } from '../mocks/planet-mocks';
import { ConflictError, UnexpectedError } from '@/v1/domain/errors';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { PlanetServiceImpl } from '@/v1/service/impl/planet.service.impl';
import { param } from 'express-validator';
import redisClient from '@/v1/config/redis-client';


jest.mock('@/v1/config/redis-client');

describe('Planet Service', () => {
    let sut: PlanetService
    let planetRepository: Mock<PlanetRepository>;

    beforeAll(() => {
        planetRepository = mock<PlanetRepository>()
        sut =  new PlanetServiceImpl(planetRepository)
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Planet', () => {
        beforeEach(() => {
            planetRepository.findByName.mockResolvedValue(null);
        })

        it('Should call findByName with correct values', async () => {
            const params = planetWithNoIdFactory
            const savedPlanet = planetWithIdFromPlanetFactory(params)

            planetRepository.save.mockResolvedValue(savedPlanet)

            await sut.create(params)
            expect(planetRepository.findByName).toHaveBeenCalledWith(params.name)
            expect(planetRepository.findByName).toHaveBeenCalledTimes(1)
        })

        it('Should throw ConflictError if the planet is already registered', async () => {
            const params = planetWithNoIdFactory
            const savedPlanet = planetWithIdFromPlanetFactory(params)
            planetRepository.findByName.mockResolvedValue(savedPlanet);

            const promise = sut.create(params);
            await  expect(promise).rejects.toThrow(new ConflictError("Planet is already registered!"))
        })

        it('Should call save with correct values', async () => {
            const params = planetWithNoIdFactory
            const savedPlanet = planetWithIdFromPlanetFactory(params)

            planetRepository.save.mockResolvedValue(savedPlanet)

            await sut.create(params)
            expect(planetRepository.save).toHaveBeenCalledWith(params)
            expect(planetRepository.save).toHaveBeenCalledTimes(1)
        })

        it('Should save planet info', async () => {
            const params = planetWithNoIdFactory
            const savedPlanet = planetWithIdFromPlanetFactory(params)

            planetRepository.save.mockResolvedValue(savedPlanet)

            await sut.create(params)
            expect(redisClient.del).toHaveBeenCalledWith('planets')
        })
    })

    describe('Read all Planets', () => {
        it('Should return cached planets if available', async () => {
            const cachedPlanets = JSON.stringify(planetsWithIdFactory());
            (redisClient.get as jest.Mock).mockResolvedValue(cachedPlanets);

            const result = await sut.readAll()

            expect(redisClient.get).toHaveBeenCalledTimes(1)
            expect(redisClient.get).toHaveBeenCalledWith('planets')
            expect(result).toEqual(JSON.parse(cachedPlanets))
        });

        it('Should return planets from database if cache is empty', async () => {
            const planets = planetsWithIdFactory();

            (redisClient.get as jest.Mock).mockResolvedValue(null);
            planetRepository.findAll.mockResolvedValue(planets)

            const result = await sut.readAll()
            expect(planetRepository.findAll).toHaveBeenCalledTimes(1)
            expect(result.length).toBe(planets.length)
            expect(result[0].id).toBe(planets[0].id)
        });
    })
})