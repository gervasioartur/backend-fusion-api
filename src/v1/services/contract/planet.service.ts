import {Planet} from "@/v1/domain/entity/planet";

export interface  PlanetService {
    create(planet: Planet): Promise<void>;
}