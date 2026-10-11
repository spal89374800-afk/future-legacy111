const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const { createServer: createViteServer } = require('vite');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

async function startServer() {
  const app = express();

  // Enable CORS
  app.use(cors());

  // Body Parser Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Mount Modular Backend API
  const backendRouter = require('./backend/server');
  app.use('/api', backendRouter);

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false 
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handler Middleware
  app.use(errorHandler);

  const PORT = 3000;

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  server.on('error', (err) => {
    logger.error(`Server listen error: ${err.message}`, err);
  });
}

startServer().catch((err) => {
  logger.error('Failed to initialize server:', err);
});