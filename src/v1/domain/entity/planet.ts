import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("t_planets")
export class Planet {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column({type: 'varchar'})
    public name: string;

    @Column({type: 'varchar'})
    public climate: string;

    @Column({type: 'varchar'})
    public terrain: string;

    @Column({ type: 'int', nullable: true })
    public population: number;

    constructor(name: string, climate: string, terrain: string, population?: number) {
        this.name = name;
        this.climate = climate;
        this.terrain = terrain;
        this.population = population ?? 0;
    }
}