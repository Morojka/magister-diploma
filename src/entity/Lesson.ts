import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {ScheduleDay} from "./ScheduleDay";

@Entity()
export class Lesson {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    number: number;

    @Column()
    time: string;

    @Column()
    name: string;

    @Column()
    place: string;

    @ManyToOne(type => ScheduleDay, scheduleDay => scheduleDay.lessons)
    scheduleDay: ScheduleDay;

}