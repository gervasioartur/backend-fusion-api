import { DataSource } from 'typeorm';
import { PlanetRepositoryImpl } from '../../../src/v1/persistence/repository/impl/planet.repository.impl';
import { Planet } from '../../../src/v1/domain/entity/planet';
import { da } from '@faker-js/faker';
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

})