import rateLimit from 'express-rate-limit';
import { config_vars } from '../config/env.js';

export const leadsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX_LEADS || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT',
      message: 'Too many requests',
    });
  },
});

export const transactionsRateLimiter = rateLimit({
  windowMs: config_vars.rateLimit.windowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX_TRANSACTIONS || '20', 10),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT',
      message: 'Too many requests',
    });
  },
});
