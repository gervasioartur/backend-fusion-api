import { mock,Mock } from 'ts-jest-mocker';
import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import {
    planetWithNoIdFactory,
    planetsWithIdFactory,
    planetWithIdFromPlanetFactory,
    planetWithIdFactory,
} from '../mocks/planet-mocks';
import { ConflictError, NotFoundError } from '@/v1/domain/errors';
import { PlanetService } from '@/v1/service/contract/planet.service';
import { PlanetServiceImpl } from '@/v1/service/impl/planet.service.impl';
import redisClient from '@/v1/config/redis-client';


jest.mock('@/v1/config/redis-client');

describe('Planet Service', () => {
    let sut: PlanetService
    let planetRepository: Mock<PlanetRepository>;
    let memoryCache: { [key: string]: string } = {};

    beforeEach(() => {
        memoryCache = {};
    });

    beforeAll(() => {
        planetRepository = mock<PlanetRepository>()
        sut =  new PlanetServiceImpl(planetRepository)
    })

    afterEach(() => {
        jest.clearAllMocks();
        memoryCache = {};
    });

    afterAll(async () => {
        await redisClient.disconnect();
    });

    (redisClient.get as jest.Mock).mockImplementation((key: string) => {
        return memoryCache[key] ? Promise.resolve(memoryCache[key]) : Promise.resolve(null);
    });

    (redisClient.set as jest.Mock).mockImplementation((key: string, value: string) => {
        memoryCache[key] = value;
        return Promise.resolve();
    });

    (redisClient.del as jest.Mock).mockImplementation((key: string) => {
        delete memoryCache[key];
        return Promise.resolve();
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

    describe('Read planet by id', () => {
        it('Should call findById with correct params on read planet by id', async () => {
            const id = 'any_id'
            const planet = planetWithIdFactory()

            planetRepository.findById.mockResolvedValue(planet)

            await sut.readById(id)
            expect(planetRepository.findById).toHaveBeenCalledWith(id)
            expect(planetRepository.findById).toHaveBeenCalledTimes(1)
        });

        it('Should throw NotFoundError if planet does not exists on read planet by id', async () => {
            const id = 'any_id'

            planetRepository.findById.mockResolvedValue(null)

            const promise = sut.readById(id)
            await  expect(promise).rejects.toThrow(new NotFoundError())
        })

        it('Should return planet if it exists', async () => {
            const id = 'any_id'
            const planet = planetWithIdFactory()

            planetRepository.findById.mockResolvedValue(planet)

            const result = await sut.readById(id)
            expect(result).toEqual(planet)
        });
    })

    describe('Update planet', () => {
        it('Should call findById with correct params on update planet', async () => {
            const planet = planetWithIdFactory()
            planetRepository.findById.mockResolvedValue(planet)

            await sut.update(planet)
            expect(planetRepository.findById).toHaveBeenCalledWith(planet.id)
            expect(planetRepository.findById).toHaveBeenCalledTimes(1)
        });

        it('Should throw NotFoundError if planet does not exist on update planet', async () => {
            const planet = planetWithIdFactory()
            planetRepository.findById.mockResolvedValue(null)

            const promise = sut.update(planet)
            await  expect(promise).rejects.toThrow(new NotFoundError())
        });
    })
})