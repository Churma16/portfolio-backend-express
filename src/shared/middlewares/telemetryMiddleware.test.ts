import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import express, { Request, Response } from 'express';
import {
  telemetryMiddleware,
  createTelemetryMiddleware,
  dispatchTelemetry,
  TelemetryPayload,
} from './telemetryMiddleware';

describe('Telemetry Middleware & Dispatcher Tests', () => {
  it('disabled: passes through cleanly without dispatching when MONITOR_URL is empty', async () => {
    const prevMonitorUrl = process.env.MONITOR_URL;
    delete process.env.MONITOR_URL;

    try {
      const app = express();
      app.use(createTelemetryMiddleware(''));
      app.get('/ping', (_req: Request, res: Response) => {
        res.status(200).send('pong');
      });

      const server = http.createServer(app);
      await new Promise<void>((resolve) => server.listen(0, resolve));
      const port = (server.address() as AddressInfo).port;

      const response = await fetch(`http://127.0.0.1:${port}/ping`);
      const body = await response.text();

      assert.equal(response.status, 200);
      assert.equal(body, 'pong');

      server.close();
    } finally {
      if (prevMonitorUrl) process.env.MONITOR_URL = prevMonitorUrl;
    }
  });

  it('success: records request latency and dispatches fire-and-forget telemetry payload', async () => {
    let receivedPayload: any = null;

    const monitorServer = http.createServer((req, res) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        receivedPayload = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      });
    });

    await new Promise<void>((resolve) => monitorServer.listen(0, resolve));
    const monitorPort = (monitorServer.address() as AddressInfo).port;
    const monitorUrl = `http://127.0.0.1:${monitorPort}/api/events`;

    const app = express();
    app.use(createTelemetryMiddleware(monitorUrl));

    const router = express.Router();
    router.get('/projects/:id', (req: Request, res: Response) => {
      setTimeout(() => {
        res.status(200).json({ id: req.params.id, title: 'Portfolio Project' });
      }, 15);
    });
    app.use('/api', router);

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const appPort = (server.address() as AddressInfo).port;

    try {
      const response = await fetch(`http://127.0.0.1:${appPort}/api/projects/99`);
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.id, '99');

      // Wait briefly for fire-and-forget fetch to reach monitor server
      for (let i = 0; i < 20; i++) {
        if (receivedPayload) break;
        await new Promise((r) => setTimeout(r, 25));
      }

      assert.notEqual(receivedPayload, null, 'Expected telemetry payload to be received');
      assert.equal(receivedPayload.source, 'express');
      assert.equal(receivedPayload.type, 'http_request');
      assert.equal(receivedPayload.endpoint, '/api/projects/:id');
      assert.equal(receivedPayload.status_code, 200);
      assert.ok(receivedPayload.duration_ms >= 10, `Duration should be >= 10ms, got ${receivedPayload.duration_ms}`);
    } finally {
      server.close();
      monitorServer.close();
    }
  });

  it('slow monitor non-blocking: completes user request immediately without waiting for slow monitor', async () => {
    // Monitor deliberately delays response by 300ms (longer than 100ms timeout)
    const slowMonitor = http.createServer((_req, res) => {
      setTimeout(() => {
        res.writeHead(200);
        res.end(JSON.stringify({ received: true }));
      }, 300);
    });

    await new Promise<void>((resolve) => slowMonitor.listen(0, resolve));
    const monitorPort = (slowMonitor.address() as AddressInfo).port;
    const monitorUrl = `http://127.0.0.1:${monitorPort}/api/events`;

    const app = express();
    app.use(createTelemetryMiddleware(monitorUrl));
    app.get('/fast-endpoint', (_req: Request, res: Response) => {
      res.status(200).json({ fast: true });
    });

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const appPort = (server.address() as AddressInfo).port;

    try {
      const startTime = Date.now();
      const response = await fetch(`http://127.0.0.1:${appPort}/fast-endpoint`);
      const elapsed = Date.now() - startTime;
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.fast, true);
      assert.ok(elapsed < 100, `Client response was blocked: took ${elapsed}ms, expected < 100ms`);
    } finally {
      server.close();
      slowMonitor.close();
    }
  });

  it('unreachable monitor: fails silently without affecting response to client', async () => {
    // Point to unreachable port
    const unreachableUrl = 'http://127.0.0.1:54321/api/events';

    const app = express();
    app.use(createTelemetryMiddleware(unreachableUrl));
    app.get('/unreachable-test', (_req: Request, res: Response) => {
      res.status(200).json({ ok: true });
    });

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const appPort = (server.address() as AddressInfo).port;

    try {
      const response = await fetch(`http://127.0.0.1:${appPort}/unreachable-test`);
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.ok, true);
    } finally {
      server.close();
    }
  });

  it('dispatchTelemetry: sends contact_submit and spam_blocked events without PII', async () => {
    const receivedEvents: any[] = [];

    const monitorServer = http.createServer((req, res) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        receivedEvents.push(JSON.parse(data));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      });
    });

    await new Promise<void>((resolve) => monitorServer.listen(0, resolve));
    const monitorPort = (monitorServer.address() as AddressInfo).port;
    const monitorUrl = `http://127.0.0.1:${monitorPort}/api/events`;

    try {
      // 1. Dispatch contact_submit
      dispatchTelemetry({
        source: 'express',
        type: 'contact_submit',
      }, monitorUrl);

      // 2. Dispatch spam_blocked with reason: honeypot
      dispatchTelemetry({
        source: 'express',
        type: 'spam_blocked',
        metadata: { reason: 'honeypot' },
      }, monitorUrl);

      // Wait for both events to arrive
      for (let i = 0; i < 20; i++) {
        if (receivedEvents.length >= 2) break;
        await new Promise((r) => setTimeout(r, 25));
      }

      assert.equal(receivedEvents.length, 2);

      const contactEvent = receivedEvents.find((e) => e.type === 'contact_submit');
      assert.notEqual(contactEvent, undefined);
      assert.equal(contactEvent.source, 'express');
      assert.equal(contactEvent.metadata, undefined);

      const spamEvent = receivedEvents.find((e) => e.type === 'spam_blocked');
      assert.notEqual(spamEvent, undefined);
      assert.equal(spamEvent.source, 'express');
      assert.deepEqual(spamEvent.metadata, { reason: 'honeypot' });

      // Explicitly ensure strictly no PII (email, name, content) exists anywhere in metadata
      for (const ev of receivedEvents) {
        if (ev.metadata) {
          assert.equal(ev.metadata.email, undefined);
          assert.equal(ev.metadata.name, undefined);
          assert.equal(ev.metadata.content, undefined);
        }
      }
    } finally {
      monitorServer.close();
    }
  });
});
