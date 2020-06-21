import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Record} from "./Record";

@Entity()
export class Group {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    semester: number;

    @OneToMany(type => Record, record => record.group)
    records: Record[]

}