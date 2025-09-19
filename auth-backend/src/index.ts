import { app } from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    const server = app.listen(config.app.port, () => {
      logger.info(`Server running on port ${config.app.port}`, {
        environment: config.app.env,
        port: config.app.port,
        baseUrl: config.app.baseUrl,
      });
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force close server after 10 seconds
      setTimeout(() => {
        logger.error('Forcing server shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();