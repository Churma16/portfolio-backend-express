import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { Request } from 'express';
import redisClient from '../config/redis';
import sequelize from '../config/database';
import { ProjectController } from './projectController';
import { TechStackController } from './techStackController';
import { WorkExperienceController } from './workExperienceController';
import { IProjectUsecase, ProjectUsecase } from '../usecases/projectUsecase';
import { ITechStackUsecase, TechStackUsecase } from '../usecases/techStackUsecase';
import { IWorkExperienceUsecase, WorkExperienceUsecase } from '../usecases/workExperienceUsecase';
import { IProjectRepository, Project } from '../domain/Project';
import { ITechStackRepository, TechStack } from '../domain/TechStack';
import { IWorkExperienceRepository, WorkExperience } from '../domain/WorkExperience';

const createMockResponse = () => {
  const responseState = {
    statusCode: 200,
    body: null as any,
  };

  const response: any = {
    status(code: number) {
      responseState.statusCode = code;
      return response;
    },
    json(payload: any) {
      responseState.body = payload;
      return response;
    },
    getState() {
      return responseState;
    },
  };

  return response;
};

describe('Reorder Endpoints Contract Tests', () => {
  describe('ProjectController.reorder', () => {
    it('returns 400 when direction is missing in request body', async () => {
      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async () => true,
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: '1' },
        body: {},
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 400);
      assert.match(response.getState().body.meta.message, /Direction is required/);
    });

    it('returns 400 when direction is not "up" or "down"', async () => {
      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async () => true,
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: '1' },
        body: { direction: 'invalid_direction' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 400);
      assert.match(response.getState().body.meta.message, /Direction is required and must be "up" or "down"/);
    });

    it('returns 400 when ID is invalid', async () => {
      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async () => true,
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: 'not_a_number' },
        body: { direction: 'up' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 400);
      assert.equal(response.getState().body.meta.message, 'Invalid ID');
    });

    it('returns 404 when project is not found', async () => {
      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async () => false,
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: '999' },
        body: { direction: 'up' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 404);
      assert.equal(response.getState().body.meta.message, 'Project not found');
    });

    it('successfully swaps item with direction "up"', async () => {
      let recordedId = 0;
      let recordedDirection = '';

      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async (id: number, direction: 'up' | 'down') => {
          recordedId = id;
          recordedDirection = direction;
          return true;
        },
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: '5' },
        body: { direction: 'up' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 200);
      assert.equal(response.getState().body.meta.status, 'success');
      assert.equal(response.getState().body.meta.message, 'Project reordered successfully');
      assert.equal(recordedId, 5);
      assert.equal(recordedDirection, 'up');
    });

    it('successfully swaps item with direction "down"', async () => {
      let recordedId = 0;
      let recordedDirection = '';

      const mockUsecase: IProjectUsecase = {
        getAll: async () => [],
        create: async () => ({} as Project),
        update: async () => null,
        delete: async () => true,
        reorder: async (id: number, direction: 'up' | 'down') => {
          recordedId = id;
          recordedDirection = direction;
          return true;
        },
      };

      const controller = new ProjectController(mockUsecase);
      const request = {
        params: { id: '5' },
        body: { direction: 'down' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 200);
      assert.equal(response.getState().body.meta.status, 'success');
      assert.equal(recordedId, 5);
      assert.equal(recordedDirection, 'down');
    });
  });

  describe('TechStackController.reorder', () => {
    it('returns 400 when direction is missing in request body', async () => {
      const mockUsecase: ITechStackUsecase = {
        getAll: async () => [],
        create: async () => ({} as TechStack),
        update: async () => null,
        delete: async () => true,
        reorder: async () => true,
      };

      const controller = new TechStackController(mockUsecase);
      const request = {
        params: { id: '2' },
        body: {},
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 400);
      assert.match(response.getState().body.meta.message, /Direction is required/);
    });

    it('successfully swaps tech stack with direction "up"', async () => {
      let recordedDirection = '';

      const mockUsecase: ITechStackUsecase = {
        getAll: async () => [],
        create: async () => ({} as TechStack),
        update: async () => null,
        delete: async () => true,
        reorder: async (_id: number, direction: 'up' | 'down') => {
          recordedDirection = direction;
          return true;
        },
      };

      const controller = new TechStackController(mockUsecase);
      const request = {
        params: { id: '2' },
        body: { direction: 'up' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 200);
      assert.equal(response.getState().body.meta.message, 'TechStack reordered successfully');
      assert.equal(recordedDirection, 'up');
    });
  });

  describe('WorkExperienceController.reorder', () => {
    it('returns 400 when direction is invalid', async () => {
      const mockUsecase: IWorkExperienceUsecase = {
        getAll: async () => [],
        create: async () => ({} as WorkExperience),
        update: async () => null,
        delete: async () => true,
        reorder: async () => true,
      };

      const controller = new WorkExperienceController(mockUsecase);
      const request = {
        params: { id: '3' },
        body: { direction: 'left' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 400);
      assert.match(response.getState().body.meta.message, /Direction is required and must be "up" or "down"/);
    });

    it('successfully swaps work experience with direction "down"', async () => {
      let recordedDirection = '';

      const mockUsecase: IWorkExperienceUsecase = {
        getAll: async () => [],
        create: async () => ({} as WorkExperience),
        update: async () => null,
        delete: async () => true,
        reorder: async (_id: number, direction: 'up' | 'down') => {
          recordedDirection = direction;
          return true;
        },
      };

      const controller = new WorkExperienceController(mockUsecase);
      const request = {
        params: { id: '3' },
        body: { direction: 'down' },
      } as unknown as Request;
      const response = createMockResponse();

      await controller.reorder(request, response);

      assert.equal(response.getState().statusCode, 200);
      assert.equal(response.getState().body.meta.message, 'WorkExperience reordered successfully');
      assert.equal(recordedDirection, 'down');
    });
  });

  describe('Usecase Reorder Delegation', () => {
    it('delegates reorder with direction from ProjectUsecase to ProjectRepository', async () => {
      let delegatedDirection = '';

      const mockRepo: IProjectRepository = {
        findAll: async () => [],
        findById: async () => null,
        create: async (data: Project) => data,
        update: async () => null,
        delete: async () => true,
        reorder: async (_id: number, direction: 'up' | 'down') => {
          delegatedDirection = direction;
          return true;
        },
      };

      const usecase = new ProjectUsecase(mockRepo);
      const result = await usecase.reorder(10, 'up');

      assert.equal(result, true);
      assert.equal(delegatedDirection, 'up');
    });

    it('delegates reorder with direction from TechStackUsecase to TechStackRepository', async () => {
      let delegatedDirection = '';

      const mockRepo: ITechStackRepository = {
        findAll: async () => [],
        findById: async () => null,
        create: async (data: TechStack) => data,
        update: async () => null,
        delete: async () => true,
        reorder: async (_id: number, direction: 'up' | 'down') => {
          delegatedDirection = direction;
          return true;
        },
      };

      const usecase = new TechStackUsecase(mockRepo);
      const result = await usecase.reorder(20, 'down');

      assert.equal(result, true);
      assert.equal(delegatedDirection, 'down');
    });

    it('delegates reorder with direction from WorkExperienceUsecase to WorkExperienceRepository', async () => {
      let delegatedDirection = '';

      const mockRepo: IWorkExperienceRepository = {
        findAll: async () => [],
        findById: async () => null,
        create: async (data: WorkExperience) => data,
        update: async () => null,
        delete: async () => true,
        reorder: async (_id: number, direction: 'up' | 'down') => {
          delegatedDirection = direction;
          return true;
        },
      };

      const usecase = new WorkExperienceUsecase(mockRepo);
      const result = await usecase.reorder(30, 'up');

      assert.equal(result, true);
      assert.equal(delegatedDirection, 'up');
    });
  });

  after(async () => {
    redisClient.disconnect();
    await sequelize.close();
  });
});
