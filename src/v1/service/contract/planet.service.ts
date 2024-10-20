import {Planet} from "@/v1/domain/entity/planet";

export interface  PlanetService {
    create(planet: Planet): Promise<void>;
    readAll(): Promise<Planet[]>
    readById(id: string): Promise<Planet>
    update(planet: Planet): Promise<void>
}