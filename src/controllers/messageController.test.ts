import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { AddressInfo } from 'node:net';
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
  it('silently traps spam bots when gotcha field is present and dispatches spam_blocked telemetry without saving or sending email', async () => {
    let usecaseCalled = false;
    let telemetryEvent: any = null;

    const monitorServer = http.createServer((req, res) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        telemetryEvent = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });
    });
    await new Promise<void>((resolve) => monitorServer.listen(0, resolve));
    const monitorPort = (monitorServer.address() as AddressInfo).port;
    process.env.MONITOR_URL = `http://127.0.0.1:${monitorPort}/api/events`;

    try {
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

      // Wait for telemetry event dispatch
      for (let i = 0; i < 20; i++) {
        if (telemetryEvent) break;
        await new Promise(r => setTimeout(r, 25));
      }

      assert.notEqual(telemetryEvent, null);
      assert.equal(telemetryEvent.source, 'express');
      assert.equal(telemetryEvent.type, 'spam_blocked');
      assert.deepEqual(telemetryEvent.metadata, { reason: 'honeypot' });
      assert.equal(telemetryEvent.metadata.email, undefined, 'Strictly do not include user email in telemetry metadata');
    } finally {
      delete process.env.MONITOR_URL;
      monitorServer.close();
    }
  });

  it('processes legitimate visitor contact messages when gotcha is absent and dispatches contact_submit telemetry', async () => {
    let passedPayload: any = null;
    let telemetryEvent: any = null;

    const monitorServer = http.createServer((req, res) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        telemetryEvent = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });
    });
    await new Promise<void>((resolve) => monitorServer.listen(0, resolve));
    const monitorPort = (monitorServer.address() as AddressInfo).port;
    process.env.MONITOR_URL = `http://127.0.0.1:${monitorPort}/api/events`;

    try {
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

      // Wait for telemetry event dispatch
      for (let i = 0; i < 20; i++) {
        if (telemetryEvent) break;
        await new Promise(r => setTimeout(r, 25));
      }

      assert.notEqual(telemetryEvent, null);
      assert.equal(telemetryEvent.source, 'express');
      assert.equal(telemetryEvent.type, 'contact_submit');
      assert.equal(telemetryEvent.metadata, undefined);
    } finally {
      delete process.env.MONITOR_URL;
      monitorServer.close();
    }
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
