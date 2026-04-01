import { Request, Response, NextFunction } from 'express';
import { generateRequestId } from '../../utils/request-id.generator';
import { createLogger } from '../../modules/logging/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = generateRequestId();

  // Attach to request for downstream use
  (req as any).requestId = requestId;

  const log = createLogger({ requestId });

  log.info({
    method: req.method,
    path: req.path,
    body: req.body,
  }, 'Incoming request');

  // Log response
  const originalSend = res.send;
  res.send = function (data): Response {
    log.info({
      statusCode: res.statusCode,
      responseBody: data,
    }, 'Outgoing response');
    return originalSend.call(this, data);
  };

  next();
};
