const express = require('express');
const { body, validationResult, query } = require('express-validator');
// const Order = require('../models/Order'); // Commented out for mock mode
// const Product = require('../models/Product'); // Commented out for mock mode
// const Cart = require('../models/Cart'); // Commented out for mock mode
const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new order - MOCK VERSION
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.product')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('shippingAddress.pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  body('payment.method')
    .isIn(['phonepe', 'cod', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  body('notes.customer')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Customer notes cannot exceed 500 characters')
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
      items,
      shippingAddress,
      payment,
      notes,
      discountCode
    } = req.body;

    // MOCK: Simulate order creation instead of database operations
    const orderNumber = `ORD-${Date.now()}`;
    const mockOrder = {
      _id: 'mock-order-' + Date.now(),
      orderNumber,
      user: req.user._id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: 999, // Mock price
        total: 999 * item.quantity
      })),
      subtotal: items.reduce((sum, item) => sum + (999 * item.quantity), 0),
      tax: {
        amount: items.reduce((sum, item) => sum + (999 * item.quantity), 0) * 0.18,
        rate: 18
      },
      shipping: {
        cost: 50,
        address: shippingAddress
      },
      payment: {
        method: payment.method,
        amount: items.reduce((sum, item) => sum + (999 * item.quantity), 0) * 1.18 + 50
      },
      total: items.reduce((sum, item) => sum + (999 * item.quantity), 0) * 1.18 + 50,
      notes,
      status: { current: 'pending' },
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('✅ Mock order created:', orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully (mock mode)',
      data: {
        order: mockOrder,
        orderNumber: orderNumber
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// @desc    Get user orders - MOCK VERSION
// @route   GET /api/orders
// @access  Private
router.get('/', protect, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status filter')
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

    const { page = 1, limit = 10, status } = req.query;

    // MOCK: Return mock orders for the user
    const mockOrders = [
      {
        _id: 'user-order-1',
        orderNumber: 'ORD-USER-001',
        user: req.user._id,
        items: [
          {
            product: {
              _id: 'prod-1',
              name: 'Sample Product 1',
              images: ['/images/sample1.jpg'],
              price: 999
            },
            quantity: 2,
            price: 999,
            total: 1998
          }
        ],
        subtotal: 1998,
        tax: { amount: 359.64, rate: 18 },
        shipping: { cost: 50 },
        total: 2407.64,
        status: { current: 'pending' },
        createdAt: new Date().toISOString()
      }
    ];

    // Filter by status if provided
    let filteredOrders = mockOrders;
    if (status) {
      filteredOrders = mockOrders.filter(order => order.status.current === status);
    }

    // Apply pagination
    const total = filteredOrders.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    console.log('✅ Mock user orders fetched:', paginatedOrders.length);

    res.json({
      success: true,
      count: paginatedOrders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders: paginatedOrders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
});

// @desc    Get single order - MOCK VERSION
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // MOCK: Return mock order data
    const mockOrder = {
      _id: req.params.id,
      orderNumber: 'ORD-USER-' + req.params.id,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '+91 98765 43210'
      },
      items: [
        {
          product: {
            _id: 'prod-1',
            name: 'Sample Product 1',
            images: ['/images/sample1.jpg'],
            price: 999,
            description: 'A great sample product for testing'
          },
          quantity: 2,
          price: 999,
          total: 1998
        }
      ],
      subtotal: 1998,
      tax: { amount: 359.64, rate: 18 },
      shipping: { cost: 50, address: '123 Main St, City, State 12345' },
      total: 2407.64,
      status: { current: 'pending' },
      payment: { method: 'PhonePe', status: 'pending' },
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Check if user owns this order (simple check for mock)
    if (req.user.role !== 'admin' && mockOrder.user._id !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own orders.'
      });
    }

    console.log('✅ Mock order fetched:', req.params.id);

    res.json({
      success: true,
      order: mockOrder
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
});

// @desc    Update order status (admin only) - MOCK VERSION
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Note cannot exceed 200 characters')
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

    const { status, note } = req.body;

    // MOCK: Simulate order status update
    const mockOrder = {
      _id: req.params.id,
      orderNumber: 'ORD-' + req.params.id,
      status: { current: status },
      statusHistory: [
        { status, note, updatedBy: req.user._id, updatedAt: new Date().toISOString() }
      ],
      updatedAt: new Date().toISOString()
    };

    console.log('✅ Mock order status updated:', req.params.id, status);

    res.json({
      success: true,
      message: 'Order status updated successfully (mock mode)',
      order: mockOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// @desc    Update order details (admin only) - MOCK VERSION
// @route   PUT /api/orders/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('orderNumber')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Order number must be between 3 and 50 characters'),
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('customerPhone')
    .optional()
    .matches(/^[+]?[0-9\s-()]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status'),
  body('paymentMethod')
    .optional()
    .isIn(['PhonePe', 'COD', 'Bank Transfer'])
    .withMessage('Invalid payment method'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  body('shippingAddress')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Shipping address cannot exceed 500 characters')
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

    // MOCK: Since we're in mock mode, we'll simulate order update
    // In real implementation, you would:
    // const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    console.log('✅ Mock order updated:', req.params.id, req.body);

    res.json({
      success: true,
      message: 'Order updated successfully (mock mode)',
      order: {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
});

// @desc    Cancel order - MOCK VERSION
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Cancellation reason must be between 1 and 200 characters')
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

    const { reason } = req.body;

    // MOCK: Simulate order cancellation
    const mockOrder = {
      _id: req.params.id,
      orderNumber: 'ORD-' + req.params.id,
      status: { current: 'cancelled' },
      cancellationReason: reason,
      cancelledBy: req.user._id,
      cancelledAt: new Date().toISOString()
    };

    console.log('✅ Mock order cancelled:', req.params.id, reason);

    res.json({
      success: true,
      message: 'Order cancelled successfully (mock mode)',
      order: mockOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// @desc    Get all orders (admin only) - MOCK VERSION
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid status filter'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
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

    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    // MOCK: Return mock orders data instead of database query
    const mockOrders = [
      {
        _id: '1',
        id: 1,
        orderNumber: 'ORD-2024001',
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 98765 43210'
        },
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+91 98765 43210',
        amount: 2499,
        total: 2499,
        status: { current: 'pending' },
        paymentMethod: 'PhonePe',
        paymentStatus: 'paid',
        shippingAddress: '123 Main St, City, State 12345',
        items: 3,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        id: 2,
        orderNumber: 'ORD-2024002',
        user: {
          name: 'Sarah Smith',
          email: 'sarah.smith@example.com',
          phone: '+91 98765 43211'
        },
        customerName: 'Sarah Smith',
        customerEmail: 'sarah.smith@example.com',
        customerPhone: '+91 98765 43211',
        amount: 1599,
        total: 1599,
        status: { current: 'shipped' },
        paymentMethod: 'PhonePe',
        paymentStatus: 'paid',
        shippingAddress: '456 Oak Ave, Town, State 54321',
        items: 1,
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      },
      {
        _id: '3',
        id: 3,
        orderNumber: 'ORD-2024003',
        user: {
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+91 98765 43212'
        },
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@example.com',
        customerPhone: '+91 98765 43212',
        amount: 899,
        total: 899,
        status: { current: 'delivered' },
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        shippingAddress: '789 Pine Rd, Village, State 98765',
        items: 1,
        createdAt: '2024-01-15T08:45:00Z',
        updatedAt: '2024-01-15T08:45:00Z'
      }
    ];

    // Apply filters
    let filteredOrders = [...mockOrders];
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status.current === status);
    }
    if (startDate) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= new Date(endDate));
    }

    // Apply pagination
    const total = filteredOrders.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    console.log('✅ Mock admin orders fetched:', paginatedOrders.length);

    res.json({
      success: true,
      count: paginatedOrders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders: paginatedOrders
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
});

// @desc    Get order statistics (admin only) - MOCK VERSION
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // MOCK: Return mock statistics
    const mockStats = {
      statusBreakdown: [
        { _id: 'pending', count: 5, totalAmount: 12495 },
        { _id: 'processing', count: 3, totalAmount: 4797 },
        { _id: 'shipped', count: 2, totalAmount: 3198 },
        { _id: 'delivered', count: 8, totalAmount: 15992 },
        { _id: 'cancelled', count: 1, totalAmount: 899 }
      ],
      totals: {
        totalOrders: 19,
        totalRevenue: 37381,
        averageOrderValue: 1967.42
      },
      recentOrders: [
        {
          _id: '1',
          orderNumber: 'ORD-2024001',
          user: { name: 'John Doe' },
          total: 2499,
          status: { current: 'pending' },
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024002',
          user: { name: 'Sarah Smith' },
          total: 1599,
          status: { current: 'shipped' },
          createdAt: '2024-01-15T09:15:00Z'
        }
      ]
    };

    console.log('✅ Mock order statistics fetched');

    res.json({
      success: true,
      message: 'Order statistics retrieved successfully (mock mode)',
      data: mockStats
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order statistics'
    });
  }
});

// Helper functions
function calculateShippingCost(pincode, weight) {
  // Simplified shipping calculation
  // In production, you would integrate with Delhivery API
  const baseCost = 50;
  const weightCost = Math.ceil(weight) * 10;
  return baseCost + weightCost;
}

function calculateEstimatedDelivery(pincode) {
  // Simplified delivery estimation
  // In production, you would integrate with Delhivery API
  const baseDays = 3;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + baseDays);
  return estimatedDate;
}

module.exports = router;
