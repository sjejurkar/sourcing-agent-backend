import { createApp } from './app';
import { config } from './modules/config/config';
import { logger } from './modules/logging/logger';

const app = createApp();

const server = app.listen(config.server.port, () => {
  logger.info(
    {
      port: config.server.port,
      nodeEnv: config.server.nodeEnv,
    },
    'Server started',
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
