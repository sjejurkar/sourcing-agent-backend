import { Request, Response, NextFunction } from 'express';
import { config } from '../../modules/config/config';
import { logger } from '../../modules/logging/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey || apiKey !== config.auth.apiKey) {
    logger.warn({ path: req.path }, 'Unauthorized API request');
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
      code: 'INVALID_API_KEY',
    });
    return;
  }

  next();
};
