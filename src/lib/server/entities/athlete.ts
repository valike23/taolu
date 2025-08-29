import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Score } from "./score";

@Entity()
export class Athlete extends Base {
 

  @Column()
  name!: string;

  @Column({ nullable: true })
  category!: string;

  @Column({ default: false })
  isPerforming!: boolean;

  @OneToMany(() => Score, (score) => score.athlete)
  scores!: Score[];
}
