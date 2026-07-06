import { Router } from 'express';

import { ProjectRepository } from '../repositories/projectRepository';
import { ProjectUsecase } from '../usecases/projectUsecase';
import { ProjectController } from '../controllers/projectController';

import { UserRepository } from '../repositories/userRepository';
import { UserUsecase } from '../usecases/userUsecase';
import { UserController } from '../controllers/userController';

import { CategoryRepository } from '../repositories/categoryRepository';
import { CategoryUsecase } from '../usecases/categoryUsecase';
import { CategoryController } from '../controllers/categoryController';

import { MessageRepository } from '../repositories/messageRepository';
import { MessageUsecase } from '../usecases/messageUsecase';
import { MessageController } from '../controllers/messageController';

import { TechStackRepository } from '../repositories/techStackRepository';
import { TechStackUsecase } from '../usecases/techStackUsecase';
import { TechStackController } from '../controllers/techStackController';

import { TagRepository } from '../repositories/tagRepository';
import { TagUsecase } from '../usecases/tagUsecase';
import { TagController } from '../controllers/tagController';

import { ProfileRepository } from '../repositories/profileRepository';
import { ProfileUsecase } from '../usecases/profileUsecase';
import { ProfileController } from '../controllers/profileController';

import { WorkExperienceRepository } from '../repositories/workExperienceRepository';
import { WorkExperienceUsecase } from '../usecases/workExperienceUsecase';
import { WorkExperienceController } from '../controllers/workExperienceController';
import { HealthController } from '../controllers/healthController';

import { TechStackCategoryRepository } from '../repositories/techStackCategoryRepository';
import { TechStackCategoryUsecase } from '../usecases/techStackCategoryUsecase';
import { TechStackCategoryController } from '../controllers/techStackCategoryController';

import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { rateLimiterMiddleware } from '../shared/middlewares/rateLimiterMiddleware';
import { InternalController } from '../controllers/internalController';

const apiRouter = Router();

// ==========================================
// DEPENDENCY INJECTION
// ==========================================
const projectController = new ProjectController(new ProjectUsecase(new ProjectRepository()));
const userController = new UserController(new UserUsecase(new UserRepository()));
const categoryController = new CategoryController(new CategoryUsecase(new CategoryRepository()));
const messageController = new MessageController(new MessageUsecase(new MessageRepository()));
const techStackController = new TechStackController(new TechStackUsecase(new TechStackRepository()));
const tagController = new TagController(new TagUsecase(new TagRepository()));
const profileController = new ProfileController(new ProfileUsecase(new ProfileRepository()));
const workExperienceController = new WorkExperienceController(new WorkExperienceUsecase(new WorkExperienceRepository()));
const techStackCategoryController = new TechStackCategoryController(new TechStackCategoryUsecase(new TechStackCategoryRepository()));
const healthController = new HealthController();
const internalController = new InternalController();

// ==========================================
// ROUTES GROUPS
// ==========================================

// --- PUBLIC ROUTES ---
apiRouter.get('/', (req, res) => { res.json({ message: 'API is running' }); });
apiRouter.get('/health', (req, res) => healthController.check(req, res));

// Secure cache invalidation endpoint called by Go API
apiRouter.post('/internal/cache/invalidate', (req, res) => internalController.invalidateCache(req, res));

// Auth (Note: login/me would be custom methods in UserController, currently mapped to default creation as placeholder for generic endpoints)
apiRouter.post('/login', (req, res) => userController.create(req, res)); // Assume custom logic added later

apiRouter.get('/projects', (req, res) => projectController.getAll(req, res));
apiRouter.get('/projects/:id', (req, res) => projectController.getById(req, res));

apiRouter.get('/categories', (req, res) => categoryController.getAll(req, res));
apiRouter.get('/categories/:id', (req, res) => categoryController.getById(req, res));

apiRouter.get('/tech-stacks', (req, res) => techStackController.getAll(req, res));
apiRouter.get('/tech-stacks/:id', (req, res) => techStackController.getById(req, res));

apiRouter.get('/tech-stack-categories', (req, res) => techStackCategoryController.getAll(req, res));
apiRouter.get('/tech-stack-categories/:id', (req, res) => techStackCategoryController.getById(req, res));

apiRouter.get('/tags', (req, res) => tagController.getAll(req, res));
apiRouter.get('/tags/:id', (req, res) => tagController.getById(req, res));

apiRouter.get('/profiles', (req, res) => profileController.getAll(req, res));
apiRouter.get('/profiles/:user_id', (req, res) => profileController.getById(req, res)); // Simplified parameter

apiRouter.get('/work-experiences', (req, res) => workExperienceController.getAll(req, res));
apiRouter.get('/work-experiences/:id', (req, res) => workExperienceController.getById(req, res));

// Messages with Rate Limiter
apiRouter.post('/messages', rateLimiterMiddleware('3-H'), (req, res) => messageController.create(req, res));

// --- PRIVATE ROUTES (Require Authentication) ---
apiRouter.use(authMiddleware);

apiRouter.post('/users', (req, res) => userController.create(req, res));

apiRouter.post('/projects', (req, res) => projectController.create(req, res));
apiRouter.put('/projects/:id', (req, res) => projectController.update(req, res));
apiRouter.delete('/projects/:id', (req, res) => projectController.delete(req, res));
apiRouter.post('/projects/:id/reorder', (req, res) => projectController.reorder(req, res));

apiRouter.post('/categories', (req, res) => categoryController.create(req, res));
apiRouter.put('/categories/:id', (req, res) => categoryController.update(req, res));
apiRouter.delete('/categories/:id', (req, res) => categoryController.delete(req, res));

apiRouter.post('/tech-stacks', (req, res) => techStackController.create(req, res));
apiRouter.put('/tech-stacks/:id', (req, res) => techStackController.update(req, res));
apiRouter.delete('/tech-stacks/:id', (req, res) => techStackController.delete(req, res));
apiRouter.post('/tech-stacks/:id/reorder', (req, res) => techStackController.reorder(req, res));

apiRouter.post('/tech-stack-categories', (req, res) => techStackCategoryController.create(req, res));
apiRouter.put('/tech-stack-categories/:id', (req, res) => techStackCategoryController.update(req, res));
apiRouter.delete('/tech-stack-categories/:id', (req, res) => techStackCategoryController.delete(req, res));

apiRouter.post('/tags', (req, res) => tagController.create(req, res));
apiRouter.put('/tags/:id', (req, res) => tagController.update(req, res));
apiRouter.delete('/tags/:id', (req, res) => tagController.delete(req, res));

apiRouter.post('/profiles', (req, res) => profileController.create(req, res));
apiRouter.put('/profiles/:id', (req, res) => profileController.update(req, res));
apiRouter.delete('/profiles/:id', (req, res) => profileController.delete(req, res));

apiRouter.post('/work-experiences', (req, res) => workExperienceController.create(req, res));
apiRouter.put('/work-experiences/:id', (req, res) => workExperienceController.update(req, res));
apiRouter.delete('/work-experiences/:id', (req, res) => workExperienceController.delete(req, res));
apiRouter.post('/work-experiences/:id/reorder', (req, res) => workExperienceController.reorder(req, res));

export default apiRouter;
