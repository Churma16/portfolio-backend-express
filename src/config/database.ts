import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the same Postgres DB used by the Go app
const dbSource = process.env.DB_SOURCE || 'postgresql://postgres:root@localhost:5432/go_portfolio_db';

const sequelize = new Sequelize(dbSource, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries
});

export default sequelize;
