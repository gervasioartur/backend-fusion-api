import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import { Planet } from '@/v1/domain/entity/planet';
import { ConflictError } from '@/v1/domain/errors';
import { PlanetService } from '@/v1/service/contract/planet.service';
import redisClient from '@/v1/config/redis-client';


export class  PlanetServiceImpl implements PlanetService{
    constructor(readonly planetRepository: PlanetRepository) {
    }

    async create(planet: Planet): Promise<void> {
        const savedPlanet  = await this.planetRepository.findByName(planet.name);
        if(savedPlanet != null) throw new ConflictError('Planet is already registered!')
        await this.planetRepository.save(planet)
        await redisClient.del('planets'); //invalidates the cache
    }
}