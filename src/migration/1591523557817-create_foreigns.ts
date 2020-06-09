import {MigrationInterface, QueryRunner} from "typeorm";

export class createForeigns1591523557817 implements MigrationInterface {
    name = 'createForeigns1591523557817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` MODIFY COLUMN id INT auto_increment");
        await queryRunner.query("ALTER TABLE `schedule_day` MODIFY COLUMN id INT auto_increment");
        await queryRunner.query("ALTER TABLE `lesson` MODIFY COLUMN id INT auto_increment");
        await queryRunner.query("ALTER TABLE `schedule_day` ADD CONSTRAINT `FK_c20fd78acee8617bf2029e98adf` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lesson` ADD CONSTRAINT `FK_305f3a19861e459d8aa05616e53` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_day`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lesson` DROP FOREIGN KEY `FK_305f3a19861e459d8aa05616e53`");
        await queryRunner.query("ALTER TABLE `schedule_day` DROP FOREIGN KEY `FK_c20fd78acee8617bf2029e98adf`");
    }

}
