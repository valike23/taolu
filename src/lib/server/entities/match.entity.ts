import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Match  extends Base{

  @Column({type: 'varchar', length: 200})
  redName!: string;

  @Column({type: 'varchar', length: 200})
  blueName!: string;

  @Column({ default: 0, type: 'float' })
  redScore!: number;

  @Column({ default: 0,type: 'float' })
  blueScore!: number;

  @Column({ default: 0, type: 'int' })
  round!: number;
}
