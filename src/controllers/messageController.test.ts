import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Request } from 'express';
import { MessageController } from './messageController';
import { IMessageUsecase } from '../usecases/messageUsecase';
import { Message } from '../domain/Message';

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

describe('MessageController Honeypot & Contact Tests', () => {
  it('silently traps spam bots when gotcha field is present without saving or sending email', async () => {
    let usecaseCalled = false;

    const mockUsecase: IMessageUsecase = {
      getAll: async () => [],
      create: async () => {
        usecaseCalled = true;
        return {} as Message;
      },
      update: async () => null,
      delete: async () => true,
    };

    const controller = new MessageController(mockUsecase);
    const request = {
      body: {
        name: 'Spam Bot',
        email: 'spambot@spam.com',
        content: 'Buy crypto now!',
        gotcha: 'I am a bot filling hidden fields',
      },
    } as unknown as Request;
    const response = createMockResponse();

    await controller.create(request, response);

    assert.equal(response.getState().statusCode, 201);
    assert.equal(response.getState().body.meta.status, 'success');
    assert.equal(response.getState().body.meta.message, 'Message created successfully');
    assert.equal(response.getState().body.data, null);
    assert.equal(usecaseCalled, false, 'Expected usecase.create to NOT be called when gotcha honeypot is filled');
  });

  it('processes legitimate visitor contact messages when gotcha is absent', async () => {
    let passedPayload: any = null;

    const mockUsecase: IMessageUsecase = {
      getAll: async () => [],
      create: async (payload: any) => {
        passedPayload = payload;
        return new Message({
          id: 101,
          name: payload.name,
          email: payload.email,
          content: payload.content,
          is_read: false,
        });
      },
      update: async () => null,
      delete: async () => true,
    };

    const controller = new MessageController(mockUsecase);
    const request = {
      body: {
        name: 'Alice Legit',
        email: 'alice@example.com',
        content: 'I would like to hire you for a project.',
      },
    } as unknown as Request;
    const response = createMockResponse();

    await controller.create(request, response);

    assert.equal(response.getState().statusCode, 201);
    assert.equal(response.getState().body.meta.status, 'success');
    assert.equal(response.getState().body.data.id, 101);
    assert.equal(response.getState().body.data.name, 'Alice Legit');
    assert.notEqual(passedPayload, null);
    assert.equal(passedPayload.name, 'Alice Legit');
  });

  it('handles usecase error by returning 400 Bad Request', async () => {
    const mockUsecase: IMessageUsecase = {
      getAll: async () => [],
      create: async () => {
        throw new Error('Validation failed: email is required');
      },
      update: async () => null,
      delete: async () => true,
    };

    const controller = new MessageController(mockUsecase);
    const request = {
      body: {
        name: 'Missing Email',
      },
    } as unknown as Request;
    const response = createMockResponse();

    await controller.create(request, response);

    assert.equal(response.getState().statusCode, 400);
    assert.equal(response.getState().body.meta.status, 'error');
    assert.match(response.getState().body.meta.message, /Validation failed/);
  });
});
