const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global in-memory storage for when database is disconnected
global.mockStorage = {
  applications: [],
  contacts: [],
  testimonials: [],
  announcements: []
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kunigiriraghunath9493:oIgHpKQtG6GcA4fQ@acn.oa10h.mongodb.net/AmericanCollege?retryWrites=true&w=majority&appName=ACN';

console.log('🔄 Attempting to connect to MongoDB...');
console.log('📋 Database name:', MONGODB_URI.split('/').pop().split('?')[0]);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('🔍 Error details:', error);
  console.log('💡 Please check:');
  console.log('   - Internet connection');
  console.log('   - MongoDB Atlas cluster status');
  console.log('   - IP whitelist settings in MongoDB Atlas');
  console.log('   - Username and password credentials');
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
  res.json({ 
    status: 'OK', 
    message: 'American Nursing College API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API endpoints available at http://localhost:${PORT}/api`);
}); 