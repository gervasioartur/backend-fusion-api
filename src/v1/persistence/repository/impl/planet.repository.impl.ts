import {Planet} from "@/v1/domain/entity/planet";
import {PlanetRepository} from "@/v1/persistence/repository/contract/planet.repository";
import {Repository} from "typeorm";

export  class PlanetRepositoryImpl extends Repository<Planet> implements PlanetRepository {
    async findByName(name: string): Promise<Planet | null> {
        return await this.findOne({ where: {  name, active: true } });
    }

    async findAll(): Promise<Planet[]> {
        return await this.find({where: { active: true }});
    }

    async findById(id: string): Promise<Planet | null> {
        const planet = await this.findOne({where: {id,  active: true }});
        return planet ? planet : null
    }

    async updatePlanet(planet: Planet): Promise<void> {
        await this.save(planet)
    }

    async deletePlanet(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}