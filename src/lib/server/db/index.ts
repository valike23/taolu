import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'wushu.db',
  synchronize: true,
  entities: [Match],
});
