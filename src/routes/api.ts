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


// ==========================================
// ROUTES
// ==========================================
apiRouter.get('/projects', (req, res) => projectController.getAll(req, res));
apiRouter.post('/projects', (req, res) => projectController.create(req, res));

apiRouter.get('/users', (req, res) => userController.getAll(req, res));
apiRouter.post('/users', (req, res) => userController.create(req, res));

apiRouter.get('/categories', (req, res) => categoryController.getAll(req, res));
apiRouter.post('/categories', (req, res) => categoryController.create(req, res));

apiRouter.get('/messages', (req, res) => messageController.getAll(req, res));
apiRouter.post('/messages', (req, res) => messageController.create(req, res));

apiRouter.get('/tech-stacks', (req, res) => techStackController.getAll(req, res));
apiRouter.post('/tech-stacks', (req, res) => techStackController.create(req, res));

apiRouter.get('/tags', (req, res) => tagController.getAll(req, res));
apiRouter.post('/tags', (req, res) => tagController.create(req, res));

apiRouter.get('/profiles', (req, res) => profileController.getAll(req, res));
apiRouter.post('/profiles', (req, res) => profileController.create(req, res));

apiRouter.get('/work-experiences', (req, res) => workExperienceController.getAll(req, res));
apiRouter.post('/work-experiences', (req, res) => workExperienceController.create(req, res));

export default apiRouter;
