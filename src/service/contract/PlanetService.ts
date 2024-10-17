import {CreatePlanetRequest} from "@/dto/CreatePlanetRequest";

export interface  PlanetService {
    create({name, climate,terrain,population }: CreatePlanetRequest): Promise<void>;
}