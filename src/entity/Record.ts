import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany} from "typeorm";
import {Group} from "./Group";
import {User} from "./User";

@Entity()
export class Record {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @ManyToOne(type => Group, group => group.records)
    group: Group;

    @OneToMany(type => User, user => user.record)
    users: User[];

}