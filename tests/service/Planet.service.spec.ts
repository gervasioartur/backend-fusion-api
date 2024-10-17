import {PlanetService} from "@/service/contract/PlanetService";
import {planetFactory} from "@/tests/mocks/planet-mocks";

describe('Planet Service', () => {
    let sut: PlanetService

    beforeEach(() => {
        sut = {create: jest.fn().mockResolvedValue(undefined)}
    })

    it('Should call create planet with correct values', async () => {
        await sut.create(planetFactory)
        expect(sut.create).toHaveBeenCalledWith(planetFactory)
        expect(sut.create).toHaveBeenCalledTimes(1)
    })
})