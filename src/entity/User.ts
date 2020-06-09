import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ScheduleDay} from "./ScheduleDay";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    record_number: string;

    @Column()
    vk_id: string;

    @OneToMany(type => ScheduleDay, scheduleDay => scheduleDay.user)
    scheduleDays: ScheduleDay[]

}