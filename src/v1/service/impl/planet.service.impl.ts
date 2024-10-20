import { PlanetRepository } from '@/v1/persistence/repository/contract/planet.repository';
import { Planet } from '@/v1/domain/entity/planet';
import { ConflictError, NotFoundError } from '@/v1/domain/errors';
import { PlanetService } from '@/v1/service/contract/planet.service';
import redisClient from '@/v1/config/redis-client';


export class  PlanetServiceImpl implements PlanetService{
    constructor(readonly planetRepository: PlanetRepository) {
    }

    async create(planet: Planet): Promise<void> {
        const savedPlanet  = await this.planetRepository.findByName(planet.name);
        if(savedPlanet != null) throw new ConflictError('Planet is already registered!')
        planet.active =  true
        await this.planetRepository.save(planet)
        await redisClient.del('planets'); //invalidates the cache
    }

    async readAll(): Promise<Planet[]> {
        const cashedPlanets = await redisClient.get('planets')
        if(cashedPlanets) return JSON.parse(cashedPlanets)
        const planets = await this.planetRepository.findAll()
        await redisClient.set('planets', JSON.stringify(planets))
        return planets
    }

    async readById(id: string): Promise<Planet> {
        const planet = await this.planetRepository.findById(id)
        if (!planet) throw new NotFoundError()
        return planet
    }

    async update(planet: Planet): Promise<void> {
        const savedPlanet = await this.readById(planet.id)
        const isValidName =  await this.planetRepository.findByName(savedPlanet.name)

        if(isValidName != null) throw new ConflictError('Planet name already taken')

        savedPlanet.name =  planet.name !== savedPlanet.name && planet.name !== "" ? planet.name : savedPlanet.name
        savedPlanet.climate = planet.climate !== savedPlanet.climate && planet.climate !== "" ? planet.climate : savedPlanet.climate
        savedPlanet.terrain =  planet.terrain !== savedPlanet.terrain && planet.terrain !== "" ? planet.terrain : savedPlanet.terrain
        savedPlanet.population = planet.population !== savedPlanet.population ? planet.population : savedPlanet.population

        await this.planetRepository.updatePlanet(savedPlanet)
        await redisClient.del('planets');
    }
}