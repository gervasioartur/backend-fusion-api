import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("t_planets")
export class Planet {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public name: string;

    @Column()
    public climate: string;

    @Column()
    public terrain: string;

    @Column({ nullable: true })
    public population: number;

    constructor(name: string, climate: string, terrain: string, population?: number) {
        this.name = name;
        this.climate = climate;
        this.terrain = terrain;
        this.population = population ?? 0;
    }
}