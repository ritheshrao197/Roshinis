const express = require('express');
const { body, validationResult } = require('express-validator');
const phonepeService = require('../services/phonepeService');
const emailService = require('../services/emailService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
router.post('/initiate', protect, [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be greater than 0'),
  body('customerName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Customer name must be between 2 and 50 characters'),
  body('customerEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('customerPhone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('redirectUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid redirect URL')
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
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      redirectUrl
    } = req.body;

    // Validate payment data
    try {
      phonepeService.validatePaymentData({
        orderId,
        amount,
        customerName,
        customerEmail,
        customerPhone
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Initiate payment with PhonePe
    const paymentResult = await phonepeService.initiatePayment({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      redirectUrl
    });

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: paymentResult
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment'
    });
  }
});

// @desc    Verify payment status
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, [
  body('transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required')
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

    const { transactionId } = req.body;

    // Verify payment with PhonePe
    const verificationResult = await phonepeService.verifyPayment(transactionId);

    res.json({
      success: true,
      message: 'Payment verification completed',
      data: verificationResult
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
});

// @desc    PhonePe webhook callback
// @route   POST /api/payments/callback
// @access  Public (PhonePe webhook)
router.post('/callback', async (req, res) => {
  try {
    const webhookData = req.body;

    // Handle webhook data
    const webhookResult = await phonepeService.handleWebhook(webhookData);

    // Update order status based on payment status
    if (webhookResult.success) {
      console.log('Payment webhook processed successfully:', {
        orderId: webhookResult.merchantTransactionId,
        transactionId: webhookResult.transactionId,
        status: webhookResult.status,
        amount: webhookResult.amount
      });

      // TODO: Update order in database
      // In production, you would:
      // 1. Find the order by merchantTransactionId
      // 2. Update payment status and order status
      // 3. Create shipment if payment is successful
      // 4. Update inventory
      
      // For now, log the successful payment processing
      if (webhookResult.status === 'COMPLETED' || webhookResult.status === 'SUCCESS') {
        console.log('✅ Payment completed successfully - emails sent');
      } else if (webhookResult.status === 'FAILED' || webhookResult.status === 'DECLINED') {
        console.log('❌ Payment failed - failure notification sent');
      }
    }

    // Return success to PhonePe
    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        merchantTransactionId: webhookResult.merchantTransactionId,
        status: webhookResult.status
      }
    });
  } catch (error) {
    console.error('Payment webhook error:', error);
    
    // Return error to PhonePe (they will retry)
    res.status(400).json({
      success: false,
      message: error.message || 'Webhook processing failed'
    });
  }
});

// @desc    Get payment instruments
// @route   GET /api/payments/instruments
// @access  Public
router.get('/instruments', async (req, res) => {
  try {
    const instruments = await phonepeService.getPaymentInstruments();

    res.json({
      success: true,
      message: 'Payment instruments retrieved successfully',
      data: instruments
    });
  } catch (error) {
    console.error('Get payment instruments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment instruments'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', protect, [
  body('transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Refund amount must be greater than 0'),
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Refund reason must be between 1 and 200 characters')
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

    const { transactionId, amount, reason } = req.body;

    // Process refund with PhonePe
    const refundResult = await phonepeService.refundPayment(transactionId, amount, reason);

    // TODO: Update order and payment records
    // This would typically involve:
    // 1. Finding the order by transaction ID
    // 2. Updating payment status to refunded
    // 3. Updating order status
    // 4. Sending notifications

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: refundResult
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  }
});

// @desc    Get payment status mapping
// @route   GET /api/payments/status-mapping
// @access  Public
router.get('/status-mapping', (req, res) => {
  try {
    const statusMapping = phonepeService.getPaymentStatusMapping();

    res.json({
      success: true,
      message: 'Payment status mapping retrieved successfully',
      data: statusMapping
    });
  } catch (error) {
    console.error('Get status mapping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status mapping'
    });
  }
});

// @desc    Get payment configuration
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  try {
    const config = {
      environment: process.env.PHONEPE_ENVIRONMENT || 'UAT',
      supportedMethods: ['UPI', 'Card', 'Net Banking', 'Wallet'],
      currency: 'INR',
      minAmount: 1,
      maxAmount: 100000
    };

    res.json({
      success: true,
      message: 'Payment configuration retrieved successfully',
      data: config
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment configuration'
    });
  }
});

// @desc    Test email service configuration
// @route   POST /api/payments/test-email
// @access  Private
router.post('/test-email', protect, async (req, res) => {
  try {
    const result = await emailService.testEmailConfiguration();
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send test email'
    });
  }
});

// @desc    Send payment notification manually
// @route   POST /api/payments/send-notification
// @access  Private
router.post('/send-notification', protect, [
  body('orderNumber').notEmpty().withMessage('Order number is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid customer email is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      transactionId,
      shippingAddress
    } = req.body;

    const orderData = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      amount: parseFloat(amount),
      transactionId,
      shippingAddress
    };

    // Send notifications
    const userEmailResult = await emailService.sendPaymentSuccessEmailToUser(orderData);
    const adminEmailResult = await emailService.sendPaymentNotificationToAdmin(orderData);

    res.json({
      success: true,
      message: 'Payment notifications sent successfully',
      data: {
        userEmail: userEmailResult,
        adminEmail: adminEmailResult
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send notifications'
    });
  }
});

// @desc    Verify email service status
// @route   GET /api/payments/email-status
// @access  Public
router.get('/email-status', async (req, res) => {
  try {
    const isConnected = await emailService.verifyConnection();
    
    res.json({
      success: true,
      message: 'Email service status retrieved',
      data: {
        connected: isConnected,
        configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
        adminEmail: process.env.ADMIN_EMAIL || 'admin@roshinisshop.com',
        service: process.env.EMAIL_SERVICE || 'gmail'
      }
    });
  } catch (error) {
    console.error('Email status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email service status'
    });
  }
});

// @desc    Health check for payment service
// @route   GET /api/payments/health
// @access  Public
router.get('/health', async (req, res) => {
  try {
    // Basic health check
    const health = {
      service: 'PhonePe Payment Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.PHONEPE_ENVIRONMENT || 'UAT',
      merchantId: process.env.PHONEPE_MERCHANT_ID ? 'configured' : 'not configured'
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Payment health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment service health check failed'
    });
  }
});

module.exports = router;
