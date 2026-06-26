import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import apiRouter from './routes/api';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================
app.use('/api', apiRouter);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
