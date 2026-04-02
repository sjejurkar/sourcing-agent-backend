import express, { Application } from 'express';
import apiRoutes from './api/routes';
import { authenticate } from './api/middleware/auth.middleware';
import { requestLogger } from './api/middleware/request-logger.middleware';
import { errorHandler } from './api/middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Body parsing (increased limit for EOCR payloads)
  app.use(express.json({ limit: '500kb' }));
  app.use(express.urlencoded({ extended: true, limit: '500kb' }));

  // Request logging
  app.use(requestLogger);

  // Health check endpoint (no auth required)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  // API routes (with authentication)
  app.use('/api/v1', authenticate, apiRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
