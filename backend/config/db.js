const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
        logger.warn('MONGO_URI not found in .env file. Running in non-blocking mock data / memory mode.');
        return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 4000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`MongoDB Connection notice (${error.message}). The application is continuing with seamless in-memory fallbacks.`);
  }
};

module.exports = connectDB;

