import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {Lesson} from "./Lesson";

@Entity()
export class ScheduleDay {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    day: string;

    @Column()
    numerator: boolean;

    @ManyToOne(type => User, user => user.scheduleDays)
    user: User;

    @OneToMany(type => Lesson, lesson => lesson.scheduleDay)
    lessons: Lesson[]
}