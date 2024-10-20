import { DataSource } from 'typeorm';
import { PlanetRepositoryImpl } from '@/v1/persistence/repository/impl/planet.repository.impl';
import { Planet } from '@/v1/domain/entity/planet';
import { planetsWithNoIdFactory, planetWithNoIdFactory } from '../mocks/planet-mocks';

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
})