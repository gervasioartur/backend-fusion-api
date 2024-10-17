import {PlanetService} from "@/service/contract/PlanetService";
import {CreatePlanetRequest} from "@/dto/CreatePlanetRequest";

describe('Planet Service', () => {
    let sut: PlanetService

    beforeEach(() => {
        sut = {
            create: jest.fn().mockResolvedValue(undefined)
        }
    })

    it('Should call create planet with correct values', async () => {
        const planet: CreatePlanetRequest = {
            name: "any_name",
            climate: "any_climate",
            terrain: "any_terrain",
            population: 10,
        }

        await sut.create(planet)

        expect(sut.create).toHaveBeenCalledWith(planet)
        expect(sut.create).toHaveBeenCalledTimes(1)
    })
})