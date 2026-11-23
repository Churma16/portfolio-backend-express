import path from 'path';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import apiRouter from './routes/api';
import { loggerMiddleware } from './shared/middlewares/loggerMiddleware';

const app = express();
const port = process.env.PORT || 4000;

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ==========================================
// ROUTES & STATIC ASSETS
// ==========================================
const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../storage');
app.use('/storage', express.static(storagePath));
app.use('/api', apiRouter);

import { connectRedis } from './config/redis';
import { setupAssociations } from './models/associations';

// Sync database and start server
const startServer = async () => {
  try {
    setupAssociations();
    await connectRedis();
    await sequelize.sync();
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
