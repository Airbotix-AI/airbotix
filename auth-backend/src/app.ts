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
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
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