import {Planet} from "@/v1/domain/entity/planet";

export interface PlanetRepository {
    findByName(name:string): Promise<Planet | null>
    save(planet: Planet): Promise<Planet | null>
}