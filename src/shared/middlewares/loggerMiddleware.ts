import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6);
    let timeStr = `${timeInMs.toFixed(4)}ms`;
    if (timeInMs < 1) {
      timeStr = `${(timeInMs * 1000).toFixed(1)}µs`;
    }
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    let statusColor = '\x1b[0m'; // default
    if (res.statusCode >= 200 && res.statusCode < 300) statusColor = '\x1b[97;42m'; // Green
    else if (res.statusCode >= 300 && res.statusCode < 500) statusColor = '\x1b[90;43m'; // Yellow
    else if (res.statusCode >= 500) statusColor = '\x1b[97;41m'; // Red
    
    const reset = '\x1b[0m';
    const methodColor = '\x1b[97;44m'; // Blue
    
    let ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    if (ip.startsWith('::ffff:')) ip = ip.substring(7); // Clean IPv6 local format
    
    console.log(`[EXP] ${dateStr} | ${statusColor} ${res.statusCode} ${reset} |\t${timeStr.padStart(12)} | ${ip.padStart(15)} | ${methodColor} ${req.method.padEnd(7)}${reset} "${req.url}"`);
  });
  next();
};
