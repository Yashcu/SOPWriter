import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config_vars } from './config/env.js';
import mongoose from 'mongoose';
import type { Server } from 'http';

let server: Server | null = null;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();

    server = app.listen(config_vars.port, () => {
      console.log(`Server running on port ${config_vars.port}`);
      console.log(`Environment: ${config_vars.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  }

  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
