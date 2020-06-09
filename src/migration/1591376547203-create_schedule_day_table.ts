import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey} from "typeorm";

export class createScheduleDayTable1591376547203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
                name: "schedule_day",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true
                    },
                    {
                        name: "numerator",
                        type: "tinyint",
                    },
                    {
                        name: "day",
                        type: "varchar",
                    },
                    {
                        name: "userId",
                        type: "int",
                    },
                ]
            },
        ), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("schedule_day");
    }

}
