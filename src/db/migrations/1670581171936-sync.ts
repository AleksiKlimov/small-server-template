import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1670581171936 implements MigrationInterface {
    name = 'sync1670581171936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "password" character varying NOT NULL,
                "fullName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "dob" date NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}