import { mock,Mock } from 'ts-jest-mocker';
import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import { PlanetServiceImpl } from '@/v1/services/impl/planet.service.impl';
import { planetFactory } from '../mocks/planet-mocks';
import { ConflictError, UnexpectError } from '@/v1/domain/errors';
import { PlanetService } from '@/v1/services/contract/planet.service';


describe('Planet Service', () => {
    let sut: PlanetService
    let planetRepository: Mock<PlanetRepository>;

    beforeAll(() => {
        planetRepository = mock<PlanetRepository>()
        sut =  new PlanetServiceImpl(planetRepository)
    })

    beforeEach(() => {
        planetRepository.findByName.mockResolvedValue(null);
    })

    it('Should call findByName with correct values', async () => {
        const params = planetFactory
        planetRepository.save.mockResolvedValue(params)

        await sut.create(params)
        expect(planetRepository.findByName).toHaveBeenCalledWith(params.name)
        expect(planetRepository.findByName).toHaveBeenCalledTimes(1)
    })

    it('Should throw ConflictError if the planet is already registered', async () => {
        planetRepository.findByName.mockResolvedValue(planetFactory);
        const promise = sut.create(planetFactory);
        await  expect(promise).rejects.toThrow(new ConflictError("Planet is already registered!"))
    })

    it('Should call save with correct values', async () => {
        const params = planetFactory
        planetRepository.save.mockResolvedValue(params)

        await sut.create(params)
        expect(planetRepository.save).toHaveBeenCalledWith(params)
        expect(planetRepository.save).toHaveBeenCalledTimes(1)
    })

    it('Should throw UnexpectError if save returns null', async () => {
        const params = planetFactory
        planetRepository.save.mockResolvedValue(null)

        const promise = sut.create(params)
        await expect(promise).rejects.toThrow(
            new UnexpectError('An unexpected error occurred while trying save planet info.'))
    })

    it('Should save planet info', async () => {
        const params = planetFactory
        planetRepository.save.mockResolvedValue(params)
        const result = await sut.create(params)
        expect(result).toBeUndefined()
    })

})