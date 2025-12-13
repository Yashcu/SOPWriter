import mongoose from 'mongoose';
import { config_vars } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config_vars.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});
