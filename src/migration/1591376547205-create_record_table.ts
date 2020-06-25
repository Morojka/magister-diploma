import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey} from "typeorm";

export class createRecordTable1591376547205 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
                name: "record",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true
                    },
                    {
                        name: "value",
                        type: "varchar",
                    },
                    {
                        name: "groupId",
                        type: "int",
                    },
                ]
            },
        ), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("record");
    }

}
