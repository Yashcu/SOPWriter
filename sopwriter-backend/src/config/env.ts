import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().url(),
  FROM_EMAIL: z.string().email(),
  ADMIN_NOTIFY_EMAIL: z.string().email(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX: z.string().default('100'),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = parseEnv();

export const config_vars = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  mongoUri: env.MONGO_URI,
  email: {
    from: env.FROM_EMAIL,
    adminNotify: env.ADMIN_NOTIFY_EMAIL,
    smtp: {
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
  cors: {
    origin: env.CORS_ORIGIN.split(','),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX, 10),
  },
};
