const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import services
const emailService = require('./services/emailService');
const phonepeService = require('./services/phonepeService');

const app = express();
app.use(cors());
app.use(express.json());

// Test email functionality
async function testEmailIntegration() {
  console.log('🧪 Testing Email Integration for Payment Notifications');
  console.log('=' .repeat(60));
  
  try {
    // 1. Check email service configuration
    console.log('1. Checking email service configuration...');
    const isConnected = await emailService.verifyConnection();
    console.log(`   Email service connected: ${isConnected ? '✅' : '❌'}`);
    
    if (!isConnected) {
      console.log('   ⚠️  Email service not properly configured. Please check your .env file.');
      console.log('   Required variables: EMAIL_USER, EMAIL_PASSWORD, EMAIL_SERVICE');
      return;
    }
    
    // 2. Test payment success email to user
    console.log('\n2. Testing payment success email to user...');
    const testOrderData = {
      orderNumber: 'TEST-ORD-' + Date.now(),
      customerName: 'John Doe',
      customerEmail: process.env.EMAIL_USER, // Send to configured email for testing
      customerPhone: '+91 98765 43210',
      transactionId: 'TEST-TXN-' + Date.now(),
      amount: 2499,
      shippingAddress: '123 Test Street, Test City, Test State 12345'
    };
    
    try {
      await emailService.sendPaymentSuccessEmailToUser(testOrderData);
      console.log('   ✅ User payment success email sent successfully');
    } catch (error) {
      console.log(`   ❌ Failed to send user email: ${error.message}`);
    }
    
    // 3. Test payment notification email to admin
    console.log('\n3. Testing payment notification email to admin...');
    try {
      await emailService.sendPaymentNotificationToAdmin(testOrderData);
      console.log('   ✅ Admin payment notification email sent successfully');
    } catch (error) {
      console.log(`   ❌ Failed to send admin email: ${error.message}`);
    }
    
    // 4. Test payment failure email
    console.log('\n4. Testing payment failure email...');
    const failedOrderData = {
      ...testOrderData,
      orderNumber: 'FAILED-ORD-' + Date.now(),
      transactionId: 'FAILED-TXN-' + Date.now(),
      responseMessage: 'Insufficient balance in account'
    };
    
    try {
      await emailService.sendPaymentFailedEmailToUser(failedOrderData);
      console.log('   ✅ Payment failure email sent successfully');
    } catch (error) {
      console.log(`   ❌ Failed to send failure email: ${error.message}`);
    }
    
    // 5. Test PhonePe service integration
    console.log('\n5. Testing PhonePe service email integration...');
    const mockWebhookData = {
      merchantId: process.env.PHONEPE_MERCHANT_ID || 'TEST_MERCHANT',
      merchantTransactionId: 'WEBHOOK-TEST-' + Date.now(),
      transactionId: 'TXN-' + Date.now(),
      amount: 299900, // Amount in paise
      paymentState: 'COMPLETED',
      responseCode: 'SUCCESS',
      responseMessage: 'Payment completed successfully',
      customerName: 'Jane Smith',
      customerEmail: process.env.EMAIL_USER,
      customerPhone: '+91 98765 43211',
      shippingAddress: '456 Integration Test Ave, Dev City, Test State 54321'
    };
    
    try {
      const result = await phonepeService.sendPaymentNotifications({
        merchantTransactionId: mockWebhookData.merchantTransactionId,
        transactionId: mockWebhookData.transactionId,
        amount: mockWebhookData.amount / 100,
        status: mockWebhookData.paymentState
      }, mockWebhookData);
      
      console.log(`   ✅ PhonePe integration test completed: ${result.emailNotificationsSent ? 'Success' : 'Failed'}`);
    } catch (error) {
      console.log(`   ❌ PhonePe integration test failed: ${error.message}`);
    }
    
    console.log('\n🎉 Email integration testing completed!');
    console.log('\n📧 Check your email inbox for the test messages.');
    console.log('\n📝 Email Templates Sent:');
    console.log('   - Payment Success Confirmation (User)');
    console.log('   - Payment Notification (Admin)');
    console.log('   - Payment Failure Notification (User)');
    
  } catch (error) {
    console.error('❌ Email integration test failed:', error);
  }
}

// API Routes for manual testing
app.get('/test-email-integration', async (req, res) => {
  try {
    await testEmailIntegration();
    res.json({
      success: true,
      message: 'Email integration test completed. Check console and your email.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/email-config', (req, res) => {
  res.json({
    configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    service: process.env.EMAIL_SERVICE || 'Not configured',
    adminEmail: process.env.ADMIN_EMAIL || 'Not configured',
    testEmail: process.env.EMAIL_USER || 'Not configured'
  });
});

// Run test if executed directly
if (require.main === module) {
  const PORT = 5004; // Different port to avoid conflicts
  
  app.listen(PORT, () => {
    console.log(`📧 Email Test Server running on http://localhost:${PORT}`);
    console.log('\n🚀 Available endpoints:');
    console.log(`   - GET http://localhost:${PORT}/test-email-integration`);
    console.log(`   - GET http://localhost:${PORT}/email-config`);
    console.log('\n⚡ Running email integration test automatically in 3 seconds...');
    
    setTimeout(() => {
      testEmailIntegration();
    }, 3000);
  });
}

module.exports = { testEmailIntegration };