import mongoose from 'mongoose';
import dotenv from 'dotenv';
import log from '../utils/logger.js';

dotenv.config();

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      `MongoDb connection failed, MONGO_URI is missing from .env`
    );
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    log.success('MongoDb connected succesfuly');
    log.info(`Host: ${conn.connection.host}`);
    log.info(`Database: ${conn.connection.name}`);
  } catch (error) {
    throw new Error(`MongoDb connection failed, ${error.message}`);
  }
};

export default connectDb;
