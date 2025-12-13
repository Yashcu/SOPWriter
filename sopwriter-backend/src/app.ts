import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config_vars } from './config/env.js';
import publicLeadsRoutes from './routes/public/leads.routes.js';
import publicTransactionsRoutes from './routes/public/transactions.routes.js';
import configRoutes from './routes/public/config.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import { requestLogger } from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config_vars.cors.origin }));
  app.use(express.json({ limit: '10kb' }));

  // cross-cutting
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // public routes
  // Mount routes (rate limiters applied in route definitions)
  app.use('/api', publicLeadsRoutes);
  app.use('/api', publicTransactionsRoutes);
  app.use('/api/config', configRoutes);

  // admin routes
  app.use('/api/admin', adminRoutes);

  // error handler must be last
  app.use(errorHandler);

  return app;
}
