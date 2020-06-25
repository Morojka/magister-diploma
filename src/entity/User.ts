import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany, ManyToOne} from "typeorm";
import {ScheduleDay} from "./ScheduleDay";
import {Record} from "./Record";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Record, record => record.users)
    record: Record;

    @Column()
    vk_id: string;

    @OneToMany(type => ScheduleDay, scheduleDay => scheduleDay.user)
    scheduleDays: ScheduleDay[]

}