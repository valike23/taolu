import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { Athlete } from "./athlete";

@Entity()
export class Score extends Base{
 
  @Column()
  judge!: string; // "j1", "j2", "j3"

  @Column("float")
  value!: number;

  @Column("float", { default: 0 })
  deduction!: number;

  @ManyToOne(() => Athlete, (athlete) => athlete.scores, { onDelete: "CASCADE" })
  athlete!: Athlete;
}
