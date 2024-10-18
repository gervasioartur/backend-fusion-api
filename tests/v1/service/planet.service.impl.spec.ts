import {planetFactory} from "@/tests/v1/mocks/planet-mocks";
import { PlanetService } from "@/v1/services/contract/planet.service";
import {ConflictError} from "@/v1/domain/error/ConflictError";
import {PlanetRepository} from "@/v1/repository/contract/planet.repository";
import {PlanetServiceImpl} from "../../../src/v1/services/impl/planet.service.impl";
import { mock,Mock } from 'ts-jest-mocker';


describe('Planet Service', () => {
    let sut: PlanetService
    let planetRepository: Mock<PlanetRepository>;

    beforeEach(() => {
        planetRepository = mock<PlanetRepository>()
        sut =  new PlanetServiceImpl(planetRepository)
    })

    it('Should call findByName with correct values', async () => {
        const params = planetFactory

        planetRepository.findByName.mockResolvedValue(null);
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

        planetRepository.findByName.mockResolvedValue(null);
        planetRepository.save.mockResolvedValue(params)

        await sut.create(params)
        expect(planetRepository.save).toHaveBeenCalledWith(params)
        expect(planetRepository.save).toHaveBeenCalledTimes(1)
    })

})