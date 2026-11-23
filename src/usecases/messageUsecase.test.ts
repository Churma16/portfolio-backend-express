import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { MessageUsecase } from './messageUsecase';
import { IMessageRepository, Message } from '../domain/Message';

describe('MessageUsecase Notification Tests', () => {
  it('dispatches contact notification to portfolio-notifier when creating a message', async () => {
    let receivedPayload: any = null;

    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        receivedPayload = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    process.env.NOTIFIER_URL = `http://127.0.0.1:${port}/api/notify`;

    try {
      const mockRepo: IMessageRepository = {
        findAll: async () => [],
        findById: async () => null,
        create: async (msg: Message) => msg,
        update: async () => null,
        delete: async () => true,
      };

      const usecase = new MessageUsecase(mockRepo);
      const result = await usecase.create({
        name: 'Express Tester',
        email: 'express@example.com',
        content: 'Testing express to notifier dispatch',
      });

      assert.equal(result.name, 'Express Tester');

      // Wait briefly for asynchronous fetch to arrive at test server
      for (let i = 0; i < 20; i++) {
        if (receivedPayload) break;
        await new Promise(r => setTimeout(r, 50));
      }

      assert.notEqual(receivedPayload, null);
      assert.equal(receivedPayload.name, 'Express Tester');
      assert.equal(receivedPayload.email, 'express@example.com');
      assert.equal(receivedPayload.message, 'Testing express to notifier dispatch');
      assert.equal(receivedPayload.source, 'express');
    } finally {
      delete process.env.NOTIFIER_URL;
      server.close();
    }
  });
});
