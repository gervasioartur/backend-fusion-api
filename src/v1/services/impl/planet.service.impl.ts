import {PlanetService} from "@/v1/services/contract/planet.service";
import {Planet} from "@/v1/domain/entity/planet";
import {PlanetRepository} from "@/v1/repository/contract/planet.repository";
import {Errors, UnexpectError} from "@/v1/domain/errors";

export class  PlanetServiceImpl implements PlanetService{
    constructor(readonly planetRepository: PlanetRepository) {
    }

    async create(planet: Planet): Promise<void> {
        const savedPlanet  = await this.planetRepository.findByName(planet.name);
        if(savedPlanet != null) throw new Errors('Planet is already registered!')
        const result = await this.planetRepository.save(planet)
        if(result == null) throw new UnexpectError('An unexpected error occurred while trying save planet info.')
        return Promise.resolve(undefined);
    }
}