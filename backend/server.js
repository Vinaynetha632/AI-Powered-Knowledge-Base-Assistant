// Force Node.js to use Google DNS for resolving MongoDB Atlas SRV records
try {
  require('dns').setServers(['8.8.8.8', '8.8.4.4']);
  console.log('[Debug] DNS lookup forced to Google DNS (8.8.8.8)');
} catch (dnsErr) {
  console.warn('[Debug] Failed to force Google DNS:', dnsErr.message);
}

require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

// Establish connection to Database
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for development/production domains
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger middleware
app.use(morgan('dev'));

// Root health route for uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 1. Serve static files from the React frontend production build folder
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. SPA Route Fallback: For any browser page requests (Accept: text/html), serve React's index.html
app.get('*', (req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
  next();
});

// 3. Mount Backend API Routes
app.use('/', apiRoutes);

// Catch-all route for missing endpoints
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Register Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
