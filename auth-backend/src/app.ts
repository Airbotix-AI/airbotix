import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.handler';
import { createAuthRoutes } from './routes/auth.routes';
import { container } from './services/container';

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: config.app.env === 'production'
    ? [config.app.baseUrl] // Add your frontend domains
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
// Handle malformed JSON
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (err && err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON payload',
      },
      timestamp: new Date().toISOString(),
      path: _req.path,
      method: _req.method,
    });
    return;
  }
  next(err);
});
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Rate limiting (scoped to specific routes to avoid interfering with other tests/routes)
const healthLimiter = rateLimit({
  windowMs: config.app.env === 'test' ? 50 : config.rateLimit.windowMs,
  max: config.app.env === 'test' ? 20 : config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
app.get('/health', healthLimiter, (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.app.env,
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

// API routes
app.use('/auth', createAuthRoutes(container.getAuthController()));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Background cleanup task
if (config.app.env !== 'test') {
  setInterval(async () => {
    try {
      await container.runCleanupTasks();
    } catch (error) {
      logger.error('Background cleanup task failed', { error });
    }
  }, 60 * 60 * 1000); // Run every hour
}

export { app };