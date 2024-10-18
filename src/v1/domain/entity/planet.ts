import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("t_planets")
export class Planet {
    @PrimaryGeneratedColumn("uuid")
    private _id!: string;

    @Column()
    private _name: string;

    @Column()
    private _climate: string;

    @Column()
    private _terrain: string;

    @Column({ nullable: true })
    private _population: number;

    // Constructor to initialize the entity fields
    constructor(name: string, climate: string, terrain: string, population?: number) {
        this._name = name;
        this._climate = climate;
        this._terrain = terrain;
        this._population = population ?? 0;  // Default to 0 if not provided
    }

    // Getter for ID
    public get id(): string {
        return this._id;
    }

    // Getter and Setter for Name
    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    // Getter and Setter for Climate
    public get climate(): string {
        return this._climate;
    }

    public set climate(value: string) {
        this._climate = value;
    }

    // Getter and Setter for Terrain
    public get terrain(): string {
        return this._terrain;
    }

    public set terrain(value: string) {
        this._terrain = value;
    }

    // Getter and Setter for Population
    public get population(): number {
        return this._population;
    }

    public set population(value: number) {
        this._population = value;
    }
}
