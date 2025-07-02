const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://american-nursing-college.vercel.app',
        /^https:\/\/.*\.vercel\.app$/,
        'https://localhost:3000'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global in-memory storage for when database is disconnected
global.mockStorage = {
  applications: [],
  contacts: [],
  testimonials: [],
  announcements: []
};

// MongoDB connection - MUST be set in .env file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  console.error('Please create a .env file with your MongoDB connection string.');
  console.error('See environment-template.txt for the required format.');
  process.exit(1);
}

// MongoDB connection with serverless optimization
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable mongoose buffering for serverless
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    if (mongoose.connection.db) {
      console.log('📊 Database:', mongoose.connection.db.databaseName);
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('   - Error:', error.message);
    console.error('   - Please check your connection string in .env file');
    console.error('   - Ensure your IP is whitelisted in MongoDB Atlas');
    
    isConnected = false;
    
    // In serverless/production, continue with mock storage
    if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing with mock storage for serverless environment...');
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Continuing with mock storage for development...');
    } else {
      throw error; // Re-throw in production if not serverless
    }
  }
};

// Middleware to ensure database connection for each request (serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    next(); // Continue with mock storage
  }
});

// Import routes
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contacts');
const testimonialRoutes = require('./routes/testimonials');
const announcementRoutes = require('./routes/announcements');

// Use routes
app.use('/api/applications', applicationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'Server running',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for Vercel serverless functions
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
} 