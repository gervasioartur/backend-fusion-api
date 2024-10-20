import { DataSource } from 'typeorm';
import { PlanetRepositoryImpl } from '@/v1/persistence/repository/impl/planet.repository.impl';
import { Planet } from '@/v1/domain/entity/planet';
import { planetFactory } from '../mocks/planet-mocks';

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

    beforeEach(async () => {
        await  dataSource.getRepository(Planet).clear()
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('Should return null when planet is not found',async () => {
        const planet = await planetRepository.findByName(planetFactory.name)
        expect(planet).toBeNull()
    });

    it('Should save a planet and find it by name', async () => {
        const planet =  planetFactory
        planet.active =  true
        await planetRepository.save(planet)

        const savedPlanet = await planetRepository.findByName(planet.name)

        expect(savedPlanet).toBeDefined()
        expect(savedPlanet?.name).toBe(planet.name)
        expect(savedPlanet?.id).toBe(planet.id)
    })
})