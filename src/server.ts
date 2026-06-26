import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import { ProjectRepository } from './repositories/projectRepository';
import { ProjectUsecase } from './usecases/projectUsecase';
import { ProjectController } from './controllers/projectController';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ==========================================
// DEPENDENCY INJECTION
// ==========================================
const projectRepo = new ProjectRepository();
const projectUsecase = new ProjectUsecase(projectRepo);
const projectController = new ProjectController(projectUsecase);

// ==========================================
// ROUTES
// ==========================================
app.get('/api/projects', (req, res) => projectController.getAll(req, res));
app.post('/api/projects', (req, res) => projectController.create(req, res));

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
