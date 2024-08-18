import { DataSource } from 'typeorm';
import { User } from '../src/model/database/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,  
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
  connectTimeout: 20000,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => console.log('Error during Data Source initialization:', error));
