const express = require('express');
const { body, validationResult, query } = require('express-validator');
const delhiveryService = require('../services/delhiveryService');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new shipment
// @route   POST /api/shipping/create
// @access  Private
router.post('/create', protect, [
  body('orderNumber')
    .notEmpty()
    .withMessage('Order number is required'),
  body('customerName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Customer name must be between 2 and 50 characters'),
  body('customerPhone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('customerEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
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
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  body('weight')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Weight must be at least 0.1 kg'),
  body('dimensions.length')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Length must be at least 1 cm'),
  body('dimensions.width')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Width must be at least 1 cm'),
  body('dimensions.height')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Height must be at least 1 cm'),
  body('codAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('COD amount cannot be negative'),
  body('declaredValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Declared value cannot be negative')
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

    const shipmentData = req.body;

    // Create shipment with Delhivery
    const shipmentResult = await delhiveryService.createShipment(shipmentData);

    // TODO: Update order with shipment details
    // This would typically involve:
    // 1. Finding the order by orderNumber
    // 2. Adding tracking information
    // 3. Updating order status to 'shipped'
    // 4. Sending notifications

    res.json({
      success: true,
      message: 'Shipment created successfully',
      data: shipmentResult
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create shipment'
    });
  }
});

// @desc    Track shipment
// @route   GET /api/shipping/track/:waybill
// @access  Public
router.get('/track/:waybill', async (req, res) => {
  try {
    const { waybill } = req.params;

    if (!waybill) {
      return res.status(400).json({
        success: false,
        message: 'Waybill number is required'
      });
    }

    // Track shipment with Delhivery
    const trackingResult = await delhiveryService.trackShipment(waybill);

    res.json({
      success: true,
      message: 'Tracking information retrieved successfully',
      data: trackingResult
    });
  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to track shipment'
    });
  }
});

// @desc    Check pin-code serviceability
// @route   GET /api/shipping/pincode/:pincode
// @access  Public
router.get('/pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    // Check pin-code with Delhivery
    const pincodeResult = await delhiveryService.checkPinCode(pincode);

    res.json({
      success: true,
      message: 'Pin-code serviceability checked successfully',
      data: pincodeResult
    });
  } catch (error) {
    console.error('Check pincode error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check pin-code serviceability'
    });
  }
});

// @desc    Get shipping rates
// @route   POST /api/shipping/rates
// @access  Public
router.post('/rates', [
  body('fromPincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit from pincode'),
  body('toPincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit to pincode'),
  body('weight')
    .isFloat({ min: 0.1 })
    .withMessage('Weight must be at least 0.1 kg'),
  body('codAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('COD amount cannot be negative')
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

    const { fromPincode, toPincode, weight, codAmount = 0 } = req.body;

    // Get shipping rates from Delhivery
    const ratesResult = await delhiveryService.getShippingRates(fromPincode, toPincode, weight, codAmount);

    res.json({
      success: true,
      message: 'Shipping rates retrieved successfully',
      data: ratesResult
    });
  } catch (error) {
    console.error('Get shipping rates error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get shipping rates'
    });
  }
});

// @desc    Cancel shipment
// @route   POST /api/shipping/cancel
// @access  Private
router.post('/cancel', protect, [
  body('waybill')
    .notEmpty()
    .withMessage('Waybill number is required'),
  body('reason')
    .optional()
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

    const { waybill, reason = 'Customer requested cancellation' } = req.body;

    // Cancel shipment with Delhivery
    const cancelResult = await delhiveryService.cancelShipment(waybill, reason);

    // TODO: Update order status
    // This would typically involve:
    // 1. Finding the order by waybill
    // 2. Updating order status to 'cancelled'
    // 3. Sending notifications

    res.json({
      success: true,
      message: 'Shipment cancelled successfully',
      data: cancelResult
    });
  } catch (error) {
    console.error('Cancel shipment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel shipment'
    });
  }
});

// @desc    Get warehouse details
// @route   GET /api/shipping/warehouse
// @access  Private/Admin
router.get('/warehouse', protect, authorize('admin'), async (req, res) => {
  try {
    // Get warehouse details from Delhivery
    const warehouseResult = await delhiveryService.getWarehouseDetails();

    res.json({
      success: true,
      message: 'Warehouse details retrieved successfully',
      data: warehouseResult
    });
  } catch (error) {
    console.error('Get warehouse details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get warehouse details'
    });
  }
});

// @desc    Bulk shipment creation
// @route   POST /api/shipping/bulk-create
// @access  Private/Admin
router.post('/bulk-create', protect, authorize('admin'), [
  body('shipments')
    .isArray({ min: 1, max: 100 })
    .withMessage('Shipments array must contain 1 to 100 items'),
  body('shipments.*.orderNumber')
    .notEmpty()
    .withMessage('Order number is required for each shipment'),
  body('shipments.*.customerName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Customer name must be between 2 and 50 characters'),
  body('shipments.*.shippingAddress.pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit pincode for each shipment')
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

    const { shipments } = req.body;
    const results = [];
    const shipmentErrors = [];

    // Process shipments in parallel (with rate limiting)
    const batchSize = 5;
    for (let i = 0; i < shipments.length; i += batchSize) {
      const batch = shipments.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (shipment) => {
        try {
          const result = await delhiveryService.createShipment(shipment);
          results.push(result);
        } catch (error) {
          shipmentErrors.push({
            orderNumber: shipment.orderNumber,
            error: error.message
          });
        }
      });

      await Promise.all(batchPromises);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < shipments.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      message: 'Bulk shipment creation completed',
      data: {
        total: shipments.length,
        successful: results.length,
        failed: shipmentErrors.length,
        results,
        errors: shipmentErrors
      }
    });
  } catch (error) {
    console.error('Bulk shipment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bulk shipments'
    });
  }
});

// @desc    Get shipping statistics
// @route   GET /api/shipping/stats
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), [
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

    const { startDate, endDate } = req.query;

    // TODO: Implement shipping statistics
    // This would typically involve:
    // 1. Querying orders within date range
    // 2. Aggregating shipping data
    // 3. Calculating metrics like delivery times, success rates, etc.

    const stats = {
      totalShipments: 0,
      deliveredShipments: 0,
      inTransitShipments: 0,
      failedShipments: 0,
      averageDeliveryTime: 0,
      topCities: [],
      topStates: []
    };

    res.json({
      success: true,
      message: 'Shipping statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get shipping stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get shipping statistics'
    });
  }
});

// @desc    Health check for shipping service
// @route   GET /api/shipping/health
// @access  Public
router.get('/health', async (req, res) => {
  try {
    // Basic health check
    const health = {
      service: 'Delhivery Shipping Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.DELHIVERY_BASE_URL?.includes('staging') ? 'staging' : 'production',
      apiKey: process.env.DELHIVERY_API_KEY ? 'configured' : 'not configured',
      clientCode: process.env.DELHIVERY_CLIENT_CODE ? 'configured' : 'not configured'
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Shipping health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Shipping service health check failed'
    });
  }
});

module.exports = router;
