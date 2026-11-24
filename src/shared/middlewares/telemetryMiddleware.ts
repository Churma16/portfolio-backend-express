import { Request, Response, NextFunction } from 'express';

export interface TelemetryPayload {
  source: string;
  type: string;
  endpoint?: string;
  status_code?: number;
  duration_ms?: number;
  metadata?: Record<string, string>;
}

/**
 * Dispatches a fire-and-forget telemetry event to portfolio-monitor.
 * Fails silently if monitor is unreachable or times out (100ms bounded timeout).
 */
export const dispatchTelemetry = (payload: TelemetryPayload, monitorUrl?: string): void => {
  const url = (monitorUrl !== undefined ? monitorUrl : process.env.MONITOR_URL || '').trim();
  if (!url) {
    return;
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(100),
  }).catch(() => {
    // Fail silently without affecting user responses or throwing unhandled rejections
  });
};

/**
 * Creates an Express telemetry middleware instance.
 */
export const createTelemetryMiddleware = (customUrl?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const monitorUrl = (customUrl !== undefined ? customUrl : process.env.MONITOR_URL || '').trim();
    if (!monitorUrl) {
      return next();
    }

    const start = process.hrtime.bigint();
    let dispatched = false;

    const onFinish = () => {
      if (dispatched) return;
      dispatched = true;
      res.removeListener('finish', onFinish);
      res.removeListener('close', onFinish);

      const diffNs = process.hrtime.bigint() - start;
      const elapsedMs = Math.round(Number(diffNs) / 1e4) / 100;

      const routePath = req.route?.path || req.path || '';
      const endpoint = (req.baseUrl || '') + routePath;

      dispatchTelemetry({
        source: 'express',
        type: 'http_request',
        endpoint: endpoint || '/',
        status_code: res.statusCode,
        duration_ms: elapsedMs,
      }, monitorUrl);
    };

    res.on('finish', onFinish);
    res.on('close', onFinish);

    next();
  };
};

export const telemetryMiddleware = createTelemetryMiddleware();
