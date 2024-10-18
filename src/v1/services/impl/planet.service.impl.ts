import {PlanetService} from "@/v1/services/contract/planet.service";
import {Planet} from "@/v1/domain/entity/planet";
import {PlanetRepository} from "@/v1/repository/contract/planet.repository";
import {ConflictError} from "@/v1/domain/error/ConflictError";

export class  PlanetServiceImpl implements PlanetService{
    constructor(readonly planetRepository: PlanetRepository) {
    }

    async create(planet: Planet): Promise<void> {
        const savedPlanet  = await this.planetRepository.findByName(planet.name);
        if(savedPlanet != null) throw new ConflictError('Planet is already registered!')
        this.planetRepository.save(planet)
        return Promise.resolve(undefined);
    }
}