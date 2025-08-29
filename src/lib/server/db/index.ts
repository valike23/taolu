import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Athlete } from '../entities/athlete';
import { Score } from '../entities/score';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'wushu.db',
  synchronize: true,
  entities: [Match, Athlete, Score],
});
