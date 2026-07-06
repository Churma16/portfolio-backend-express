import { Response } from 'express';

export interface Meta {
  code: number;
  status: string;
  message: string;
  count?: number;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T | null;
}

export function sendSuccess<T>(res: Response, code: number, message: string, data: T, count?: number): void {
  const meta: Meta = { code, status: 'success', message };
  if (count !== undefined) meta.count = count;
  
  res.status(code).json({ meta, data });
}

export function sendError(res: Response, code: number, message: string): void {
  const meta: Meta = { code, status: 'error', message };
  res.status(code).json({ meta, data: null });
}
