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

/**
 * Automatically binds all prototype methods of a controller instance to itself,
 * enabling clean method references in Express routing without boilerplate wrapper closures.
 */
function bindController<T extends object>(controller: T): T {
  const prototype = Object.getPrototypeOf(controller);
  for (const propertyName of Object.getOwnPropertyNames(prototype)) {
    if (propertyName !== 'constructor' && typeof (controller as any)[propertyName] === 'function') {
      (controller as any)[propertyName] = (controller as any)[propertyName].bind(controller);
    }
  }
  return controller;
}

// ==========================================
// DEPENDENCY INJECTION & CONTROLLERS
// ==========================================
const projectController = bindController(new ProjectController(new ProjectUsecase(new ProjectRepository())));
const userController = bindController(new UserController(new UserUsecase(new UserRepository())));
const categoryController = bindController(new CategoryController(new CategoryUsecase(new CategoryRepository())));
const messageController = bindController(new MessageController(new MessageUsecase(new MessageRepository())));
const techStackController = bindController(new TechStackController(new TechStackUsecase(new TechStackRepository())));
const tagController = bindController(new TagController(new TagUsecase(new TagRepository())));
const profileController = bindController(new ProfileController(new ProfileUsecase(new ProfileRepository())));
const workExperienceController = bindController(new WorkExperienceController(new WorkExperienceUsecase(new WorkExperienceRepository())));
const techStackCategoryController = bindController(new TechStackCategoryController(new TechStackCategoryUsecase(new TechStackCategoryRepository())));
const healthController = bindController(new HealthController());
const internalController = bindController(new InternalController());

// ==========================================
// ROUTES GROUPS
// ==========================================

// --- PUBLIC ROUTES ---
apiRouter.get('/', (req, res) => { res.json({ message: 'API is running' }); });
apiRouter.get('/health', healthController.check);

// Secure cache invalidation endpoint called by Go API
apiRouter.post('/internal/cache/invalidate', internalController.invalidateCache);

// Auth
apiRouter.post('/login', userController.login);

apiRouter.get('/projects', projectController.getAll);
apiRouter.get('/projects/:id', projectController.getById);

apiRouter.get('/categories', categoryController.getAll);
apiRouter.get('/categories/:id', categoryController.getById);

apiRouter.get('/tech-stacks', techStackController.getAll);
apiRouter.get('/tech-stacks/:id', techStackController.getById);

apiRouter.get('/tech-stack-categories', techStackCategoryController.getAll);
apiRouter.get('/tech-stack-categories/:id', techStackCategoryController.getById);

apiRouter.get('/tags', tagController.getAll);
apiRouter.get('/tags/:id', tagController.getById);

apiRouter.get('/profiles', profileController.getAll);
apiRouter.get('/profiles/:id', profileController.getById);

apiRouter.get('/work-experiences', workExperienceController.getAll);
apiRouter.get('/work-experiences/:id', workExperienceController.getById);

// Messages with Rate Limiter
apiRouter.post('/messages', rateLimiterMiddleware('3-H'), messageController.create);

// --- PRIVATE ROUTES (Require Authentication) ---
apiRouter.use(authMiddleware);

apiRouter.post('/users', userController.create);

apiRouter.post('/projects', projectController.create);
apiRouter.put('/projects/:id', projectController.update);
apiRouter.delete('/projects/:id', projectController.delete);
apiRouter.post('/projects/:id/reorder', projectController.reorder);

apiRouter.post('/categories', categoryController.create);
apiRouter.put('/categories/:id', categoryController.update);
apiRouter.delete('/categories/:id', categoryController.delete);

apiRouter.post('/tech-stacks', techStackController.create);
apiRouter.put('/tech-stacks/:id', techStackController.update);
apiRouter.delete('/tech-stacks/:id', techStackController.delete);
apiRouter.post('/tech-stacks/:id/reorder', techStackController.reorder);

apiRouter.post('/tech-stack-categories', techStackCategoryController.create);
apiRouter.put('/tech-stack-categories/:id', techStackCategoryController.update);
apiRouter.delete('/tech-stack-categories/:id', techStackCategoryController.delete);

apiRouter.post('/tags', tagController.create);
apiRouter.put('/tags/:id', tagController.update);
apiRouter.delete('/tags/:id', tagController.delete);

apiRouter.post('/profiles', profileController.create);
apiRouter.put('/profiles/:id', profileController.update);
apiRouter.delete('/profiles/:id', profileController.delete);

apiRouter.post('/work-experiences', workExperienceController.create);
apiRouter.put('/work-experiences/:id', workExperienceController.update);
apiRouter.delete('/work-experiences/:id', workExperienceController.delete);
apiRouter.post('/work-experiences/:id/reorder', workExperienceController.reorder);

export default apiRouter;
