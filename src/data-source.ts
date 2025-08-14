import { DataSource } from 'typeorm';
import { ALL_ENTITIES } from './app.module';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'whitebird',
  entities: ALL_ENTITIES,
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
