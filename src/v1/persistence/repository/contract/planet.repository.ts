import {Planet} from "@/v1/domain/entity/planet";

export interface PlanetRepository {
    save(planet: Planet): Promise<Planet | null>
    findByName(name:string): Promise<Planet | null>
    findAll():Promise<Planet[]>
    findById(id:string): Promise<Planet | null>
    updatePlanet(planet: Planet): Promise<void>
    deletePlanet(id:string): Promise<void>
}