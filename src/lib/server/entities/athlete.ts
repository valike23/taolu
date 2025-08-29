import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Score } from "./score";

@Entity()
export class Athlete extends Base {
 

  @Column({type: "varchar", length:100})
  name!: string;

  @Column({ nullable: true , type: "varchar", length: 100})
  category!: string;

  @Column({ default: false, type:'boolean' })
  isPerforming!: boolean;

  @OneToMany(() => Score, (score) => score.athlete)
  scores!: Score[];
}
