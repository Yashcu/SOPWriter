import type { Request, Response, NextFunction } from 'express';
import logger from './requestLogger.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const reqId = (req as any).requestId || req.headers['x-request-id'] || null;
  logger.error({ reqId, err }, 'unhandled_error');

  // Standardized error response shape
  const payload: any = {
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Internal server error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.details = { stack: err.stack };
  // If validation errors were attached
  if (err.validation) payload.details = err.validation;

  // map certain known error types to status codes
  let status = 500;
  if (err.name === 'ValidationError' || err.code === 'VALIDATION_ERROR') status = 400;
  if (err.code === 'AUTH_REQUIRED' || err.code === 'AUTH_INVALID') status = 401;
  if (err.code === 'FORBIDDEN') status = 403;
  if (
    err.code === 'NOT_FOUND' ||
    err.code === 'TRANSACTION_NOT_FOUND' ||
    err.code === 'LEAD_NOT_FOUND'
  )
    status = 404;
  if (err.code === 'RATE_LIMIT') status = 429;

  res.status(status).json(payload);
}

export default errorHandler;
