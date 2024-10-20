import {Planet} from "@/v1/domain/entity/planet";
import {PlanetRepository} from "@/v1/persistence/repository/contract/planet.repository";
import {Repository} from "typeorm";

export  class PlanetRepositoryImpl extends Repository<Planet> implements PlanetRepository {
    async findByName(name: string): Promise<Planet | null> {
        return this.findOne({ where: {  name, active: true } });
    }

    findAll(): Promise<Planet[]> {
        return this.find({where: { active: true }});
    }
}