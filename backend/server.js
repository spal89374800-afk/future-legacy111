const express = require('express');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize database connection
connectDB();

const router = express.Router();

// Mount all backend API routes
router.use('/users', require('./routes/userRoutes'));
router.use('/payments', require('./routes/paymentRoutes'));
router.use('/orders', require('./routes/orderRoutes'));
router.use('/data', require('./routes/dataRoutes'));

// Status check route
router.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Future Legacy Modular Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
