import { DataSource } from 'typeorm';
import { PlanetRepositoryImpl } from '@/v1/persistence/repository/impl/planet.repository.impl';
import { Planet } from '@/v1/domain/entity/planet';
import { planetsWithNoIdFactory, planetWithNoIdFactory } from '../mocks/planet-mocks';
import { pl } from '@faker-js/faker';

describe('PlanetRepositoryImpl', () => {
    let dataSource: DataSource
    let planetRepository: PlanetRepositoryImpl

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [Planet],
        });

        await dataSource.initialize()
        planetRepository =  new PlanetRepositoryImpl(Planet,dataSource.createEntityManager())
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    describe('FindByName', () => {
        beforeEach(async () => {
            await  dataSource.getRepository(Planet).clear()
        })

        it('Should return null when planet is not found',async () => {
            const planet = await planetRepository.findByName(planetWithNoIdFactory.name)
            expect(planet).toBeNull()
        });

        it('Should save a planet and find it by name', async () => {
            const planet =  planetWithNoIdFactory
            planet.active =  true
            await planetRepository.save(planet)

            const savedPlanet = await planetRepository.findByName(planet.name)

            expect(savedPlanet).toBeDefined()
            expect(savedPlanet?.name).toBe(planet.name)
            expect(savedPlanet?.id).toBe(planet.id)
        })
    })

    describe('FindAll', () => {
        beforeEach(async () => {
            await  dataSource.getRepository(Planet).clear()
        })

        it('Should save planets and find all', async () => {
            const toSavePlanets = planetsWithNoIdFactory()

            await planetRepository.save(toSavePlanets[0]);
            await planetRepository.save(toSavePlanets[1]);

            const planets = await planetRepository.findAll()

            expect(planets).toBeDefined()
        });
    })

    describe('FindById', () => {
        beforeEach(async () => {
            await  dataSource.getRepository(Planet).clear()
        })

        it('Should null if planet does not exist on find by id', async () => {
            const id = 'any_id'
            const result = await planetRepository.findById(id)
            expect(result).toBeNull()
        });

        it('Should save planets and find by id', async () => {
            let toSavePlanet = planetWithNoIdFactory
            toSavePlanet = await planetRepository.save(toSavePlanet)

            const result = await planetRepository.findById(toSavePlanet.id)
            expect(result?.id).toBeDefined();
        });
    })

    describe('UpdatePlanet', () => {
        beforeEach(async () => {
            await  dataSource.getRepository(Planet).clear()
        })

        it('Should save and update planet', async () => {
            const savedPlanet = planetWithNoIdFactory
            await planetRepository.save(savedPlanet)

            const toUpdatePlanet = planetWithNoIdFactory
            toUpdatePlanet.id = savedPlanet.id

            await planetRepository.updatePlanet(toUpdatePlanet)
            const result = await planetRepository.findByName(toUpdatePlanet.name)

            expect(result).toBeDefined();
            expect(result?.id).toBe(savedPlanet.id)
        });
    })

    describe('DeletePlanet', () => {
        beforeEach(async () => {
            await  dataSource.getRepository(Planet).clear()
        })

        it('Should save and delete planet', async () => {
            const planet = planetWithNoIdFactory
            await planetRepository.save(planet)
            await planetRepository.deletePlanet(planet.id)
            const result = await planetRepository.findById(planet.id)
            expect(result).toBeNull();
        });
    })
})