import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let dbConfig: any = {};

switch (process.env.DB_DIALECT) {
  case 'postgres':
    dbConfig = {
      database: process.env.PG_NAME,
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      dialect: 'postgres',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
    break;
  case 'mssql':
    dbConfig = {
      database: process.env.MSSQL_NAME,
      username: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASS,
      host: process.env.MSSQL_HOST,
      port: Number(process.env.MSSQL_PORT) || 1433,
      dialect: 'mssql',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
      dialectOptions: {
        options: {
          encrypt: false,
        }
      }
    };
    break;
  case 'oracle':
    dbConfig = {
      database: process.env.ORACLE_NAME,
      username: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASS,
      host: process.env.ORACLE_HOST,
      port: Number(process.env.ORACLE_PORT) || 1521,
      dialect: 'oracle',
      dialectOptions: {
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SID}`
      },
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
    break;
  default: // mysql
    dbConfig = {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
}

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);