import { MigrationInterface, QueryRunner } from "typeorm";

export class V1CreatePlanetTable1729433097162 implements MigrationInterface {
    name = 'V1CreatePlanetTable1729433097162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "t_planets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "climate" character varying NOT NULL, "terrain" character varying NOT NULL, "population" integer, "is_active" boolean NOT NULL, CONSTRAINT "PK_2dfb6b60f114472cbdf783f8007" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "t_planets"`);
    }

}
