const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const shippingRoutes = require('./routes/shipping');

// Initialize services
const emailService = require('./services/emailService');
const phonepeService = require('./services/phonepeService');

const app = express();
const PORT = process.env.PORT || 5003;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('⚠️  MongoDB connection failed - running in demo mode');
    console.log('   To enable database features, start MongoDB or set MONGODB_URI');
    console.log('   Error:', err.message);
  }
};

// Connect to database (non-blocking)
// connectDB().catch(console.error);
console.log('⚠️  Skipping database connection for now');

// Routes
console.log('Setting up routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded');
app.use('/api/products', productRoutes);
console.log('✅ Product routes loaded');
app.use('/api/categories', categoryRoutes);
console.log('✅ Category routes loaded');
app.use('/api/orders', orderRoutes);
console.log('✅ Order routes loaded');
app.use('/api/payments', paymentRoutes);
console.log('✅ Payment routes loaded');
app.use('/api/shipping', shippingRoutes);
console.log('✅ Shipping routes loaded');

// Initialize email service
console.log('Initializing email service...');
emailService.verifyConnection()
  .then((connected) => {
    if (connected) {
      console.log('✅ Email service initialized and connected');
      console.log('📧 Email notifications enabled for payments');
    } else {
      console.log('⚠️  Email service initialized but not connected');
      console.log('   Check EMAIL_USER and EMAIL_PASSWORD in .env file');
    }
  })
  .catch((error) => {
    console.log('⚠️  Email service initialization failed:', error.message);
    console.log('   Email notifications will be disabled');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

console.log('Starting server...');
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
});
