const express = require('express');
const { body, validationResult, query } = require('express-validator');
// const Product = require('../models/Product'); // Commented out for mock mode
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const phonepeService = require('../services/phonepeService');
// const Order = require('../models/Order'); // Commented out for mock mode

const router = express.Router();

// @desc    Get all products (public) - MOCK VERSION
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'automotive', 'other'])
    .withMessage('Invalid category'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest'])
    .withMessage('Invalid sort option'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      search,
      featured
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build search query
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'name_asc':
        sortObj = { name: 1 };
        break;
      case 'name_desc':
        sortObj = { name: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      default: // newest
        sortObj = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // MOCK: Return sample products instead of database query
    const allMockProducts = [
      {
        _id: 'mock-1',
        name: 'Premium Electronics Product',
        description: 'High-quality electronics product with advanced features',
        category: 'electronics',
        price: 999,
        status: 'active',
        createdAt: new Date('2024-01-15'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-2',
        name: 'Designer Clothing Item',
        description: 'Stylish and comfortable clothing for everyday wear',
        category: 'clothing',
        price: 599,
        status: 'active',
        createdAt: new Date('2024-01-14'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-3',
        name: 'Educational Book Collection',
        description: 'Comprehensive collection of educational books',
        category: 'books',
        price: 299,
        status: 'active',
        createdAt: new Date('2024-01-13'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-4',
        name: 'Home Decor Set',
        description: 'Beautiful home decor items to enhance your living space',
        category: 'home',
        price: 799,
        status: 'active',
        createdAt: new Date('2024-01-12'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-5',
        name: 'Sports Equipment Bundle',
        description: 'Complete sports equipment for fitness enthusiasts',
        category: 'sports',
        price: 1299,
        status: 'active',
        createdAt: new Date('2024-01-11'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-6',
        name: 'Beauty Care Package',
        description: 'Premium beauty products for skincare and wellness',
        category: 'beauty',
        price: 459,
        status: 'active',
        createdAt: new Date('2024-01-10'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-7',
        name: 'Automotive Accessories',
        description: 'Essential accessories for your vehicle',
        category: 'automotive',
        price: 699,
        status: 'active',
        createdAt: new Date('2024-01-09'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-8',
        name: 'Smartphone Accessories',
        description: 'Cases, chargers, and other smartphone accessories',
        category: 'electronics',
        price: 149,
        status: 'active',
        createdAt: new Date('2024-01-08'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-9',
        name: 'Casual Wear Collection',
        description: 'Comfortable casual clothing for all occasions',
        category: 'clothing',
        price: 399,
        status: 'active',
        createdAt: new Date('2024-01-07'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-10',
        name: 'Kitchen Essentials',
        description: 'Must-have kitchen tools and appliances',
        category: 'home',
        price: 899,
        status: 'active',
        createdAt: new Date('2024-01-06'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-11',
        name: 'Fitness Tracker',
        description: 'Advanced fitness tracking device with health monitoring',
        category: 'sports',
        price: 249,
        status: 'active',
        createdAt: new Date('2024-01-05'),
        createdBy: { name: 'Admin User' }
      },
      {
        _id: 'mock-12',
        name: 'Organic Skincare Set',
        description: 'Natural and organic skincare products',
        category: 'beauty',
        price: 329,
        status: 'active',
        createdAt: new Date('2024-01-04'),
        createdBy: { name: 'Admin User' }
      }
    ];
    
    // Apply basic filtering
    let filteredProducts = allMockProducts.filter(product => {
      if (category && product.category !== category) return false;
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    
    // Apply pagination
    const total = filteredProducts.length;
    const products = filteredProducts.slice(skip, skip + parseInt(limit));

    console.log(`✅ Mock products query: returning ${products.length} of ${total} products`);

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get single product (public)
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('rating');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Only return active products to public
    if (product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Create new product (admin only) - MOCK VERSION
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'automotive', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // MOCK: Simulate successful product creation
    const mockProduct = {
      _id: 'mock-id-' + Date.now(),
      ...req.body,
      createdBy: req.user._id || 'mock-admin-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('✅ Mock product created:', mockProduct.name);

    res.status(201).json({
      success: true,
      message: 'Product created successfully (mock mode)',
      product: mockProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add this route for /api/admin/products
router.post(
  '/admin/products',
  // protect, authorize('admin'), // Uncomment if you want auth
  upload.array('images'),
  async (req, res) => {
    try {
      // req.body contains text fields
      // req.files contains uploaded images
      res.status(201).json({ success: true, message: 'Product created!' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'automotive', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('comparePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Compare price must be a positive number'),
  body('inventory.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - change status to inactive
    product.status = 'inactive';
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get product by slug (public)
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      status: 'active'
    }).populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get featured products (public)
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      status: 'active' 
    })
    .limit(8)
    .populate('createdBy', 'name');

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get products by category (public)
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate category
    const validCategories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'automotive', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({ 
      category, 
      status: 'active' 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('createdBy', 'name');

    const total = await Product.countDocuments({ category, status: 'active' });

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      category,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Initiate PhonePe payment
// @route   POST /api/payments/phonepe/initiate
// @access  Public or Private (as needed)
router.post('/phonepe/initiate', async (req, res) => {
  try {
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      redirectUrl
    } = req.body;

    // Optionally, create a pending order in DB here

    // Call the PhonePe service
    const paymentResult = await phonepeService.initiatePayment({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      redirectUrl
    });

    if (paymentResult.success) {
      res.json({ success: true, paymentUrl: paymentResult.paymentUrl });
    } else {
      res.status(400).json({ success: false, message: 'Failed to initiate PhonePe payment' });
    }
  } catch (error) {
    console.error('PhonePe initiate error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate PhonePe payment' });
  }
});

// @desc    PhonePe webhook callback
// @route   POST /api/payments/callback
router.post('/callback', async (req, res) => {
  try {
    const webhookData = req.body;
    const webhookResult = await phonepeService.handleWebhook(webhookData);

    // Find and update the order
    const order = await Order.findOne({ orderId: webhookResult.merchantTransactionId });
    if (order) {
      order.paymentStatus = webhookResult.status;
      if (webhookResult.status === 'SUCCESS') {
        order.status = 'Paid';
        // You can trigger shipment, send emails, etc. here
      } else {
        order.status = 'Payment Failed';
      }
      await order.save();
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Webhook processing failed' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { orderId, items, user, totalAmount } = req.body;
    const order = new Order({
      orderId,
      items,
      user,
      totalAmount,
      status: 'Pending',
      paymentStatus: 'Pending'
    });
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
