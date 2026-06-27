import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import apiRouter from './routes/api';
import { loggerMiddleware } from './shared/middlewares/loggerMiddleware';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ==========================================
// ROUTES
// ==========================================
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
