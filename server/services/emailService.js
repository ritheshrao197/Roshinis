const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@roshinisshop.com';
    this.initializeTransporter();
  }

  // Initialize email transporter
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      await this.transporter.verify();
      console.log('✅ Email connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email connection verification failed:', error);
      return false;
    }
  }

  // Generate email template
  generateEmailTemplate(templateName, data) {
    try {
      let template;
      
      switch (templateName) {
        case 'payment_success_user':
          template = this.getUserPaymentSuccessTemplate();
          break;
        case 'payment_success_admin':
          template = this.getAdminPaymentNotificationTemplate();
          break;
        case 'payment_failed_user':
          template = this.getUserPaymentFailedTemplate();
          break;
        default:
          throw new Error(`Unknown template: ${templateName}`);
      }

      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(data);
    } catch (error) {
      console.error('Error generating email template:', error);
      throw error;
    }
  }

  // User payment success email template
  getUserPaymentSuccessTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Confirmation - Roshini's Shop</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        .amount { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background-color: #f5f5f5; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase</p>
        </div>

        <h2>Dear {{customerName}},</h2>
        
        <p>We're excited to confirm that your payment has been processed successfully! Your order is now being prepared for shipment.</p>

        <div class="order-details">
            <h3>Order Details:</h3>
            <table class="table">
                <tr>
                    <th>Order Number:</th>
                    <td>{{orderNumber}}</td>
                </tr>
                <tr>
                    <th>Transaction ID:</th>
                    <td>{{transactionId}}</td>
                </tr>
                <tr>
                    <th>Amount Paid:</th>
                    <td class="amount">₹{{amount}}</td>
                </tr>
                <tr>
                    <th>Payment Method:</th>
                    <td>{{paymentMethod}}</td>
                </tr>
                <tr>
                    <th>Payment Date:</th>
                    <td>{{paymentDate}}</td>
                </tr>
            </table>
        </div>

        <div class="order-details">
            <h3>Delivery Information:</h3>
            <p><strong>Shipping Address:</strong><br>{{shippingAddress}}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>

        <p>You will receive a shipping confirmation email with tracking details once your order is dispatched.</p>
        
        <div style="text-align: center;">
            <a href="{{orderTrackingUrl}}" class="button">Track Your Order</a>
        </div>

        <div class="footer">
            <p><strong>Roshini's Shop</strong><br>
            Your trusted online shopping partner<br>
            📧 support@roshinisshop.com | 📞 +91-XXXXX-XXXXX</p>
            
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
        </div>
    </div>
</body>
</html>
    `;
  }

  // Admin payment notification template
  getAdminPaymentNotificationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Payment Received - Admin Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .alert-icon { font-size: 48px; margin-bottom: 10px; }
        .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        .amount { font-size: 24px; font-weight: bold; color: #4CAF50; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background-color: #f5f5f5; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .urgent { background-color: #ff9800; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon">🔔</div>
            <h1>New Payment Received</h1>
            <p>Order requires processing</p>
        </div>

        <div class="urgent">
            <strong>⚡ Action Required:</strong> New order needs to be processed and shipped
        </div>
        
        <p><strong>Hello Admin,</strong></p>
        
        <p>A new payment has been successfully processed. Please review the order details below and prepare for shipment.</p>

        <div class="order-details">
            <h3>Payment Details:</h3>
            <table class="table">
                <tr>
                    <th>Order Number:</th>
                    <td>{{orderNumber}}</td>
                </tr>
                <tr>
                    <th>Customer Name:</th>
                    <td>{{customerName}}</td>
                </tr>
                <tr>
                    <th>Customer Email:</th>
                    <td>{{customerEmail}}</td>
                </tr>
                <tr>
                    <th>Customer Phone:</th>
                    <td>{{customerPhone}}</td>
                </tr>
                <tr>
                    <th>Transaction ID:</th>
                    <td>{{transactionId}}</td>
                </tr>
                <tr>
                    <th>Amount Received:</th>
                    <td class="amount">₹{{amount}}</td>
                </tr>
                <tr>
                    <th>Payment Method:</th>
                    <td>{{paymentMethod}}</td>
                </tr>
                <tr>
                    <th>Payment Date:</th>
                    <td>{{paymentDate}}</td>
                </tr>
            </table>
        </div>

        <div class="order-details">
            <h3>Shipping Information:</h3>
            <p><strong>Delivery Address:</strong><br>{{shippingAddress}}</p>
        </div>

        <div style="text-align: center;">
            <a href="{{adminOrderUrl}}" class="button">View Order in Admin Panel</a>
        </div>

        <div class="footer">
            <p><strong>Roshini's Shop - Admin Panel</strong><br>
            Automated payment notification system</p>
            
            <p><small>This is an automated notification. Please process the order promptly.</small></p>
        </div>
    </div>
</body>
</html>
    `;
  }

  // User payment failed template
  getUserPaymentFailedTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Failed - Roshini's Shop</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .error-icon { font-size: 48px; margin-bottom: 10px; }
        .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="error-icon">❌</div>
            <h1>Payment Failed</h1>
            <p>We couldn't process your payment</p>
        </div>

        <h2>Dear {{customerName}},</h2>
        
        <p>We're sorry to inform you that your payment could not be processed. Your order has been placed on hold.</p>

        <div class="order-details">
            <h3>Transaction Details:</h3>
            <table class="table">
                <tr>
                    <th>Order Number:</th>
                    <td>{{orderNumber}}</td>
                </tr>
                <tr>
                    <th>Transaction ID:</th>
                    <td>{{transactionId}}</td>
                </tr>
                <tr>
                    <th>Amount:</th>
                    <td>₹{{amount}}</td>
                </tr>
                <tr>
                    <th>Failure Reason:</th>
                    <td>{{failureReason}}</td>
                </tr>
            </table>
        </div>

        <p><strong>What you can do:</strong></p>
        <ul>
            <li>Check your payment method details</li>
            <li>Ensure sufficient balance in your account</li>
            <li>Try using a different payment method</li>
            <li>Contact your bank if the issue persists</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="{{retryPaymentUrl}}" class="button">Retry Payment</a>
        </div>

        <div class="footer">
            <p><strong>Roshini's Shop</strong><br>
            Need help? Contact us at support@roshinisshop.com</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  // Send payment success email to user
  async sendPaymentSuccessEmailToUser(orderData) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const emailData = {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber || orderData.merchantTransactionId,
        transactionId: orderData.transactionId,
        amount: orderData.amount.toLocaleString(),
        paymentMethod: 'PhonePe',
        paymentDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        shippingAddress: orderData.shippingAddress || 'Address on file',
        orderTrackingUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/orders/${orderData.orderNumber || orderData.merchantTransactionId}`
      };

      const htmlContent = this.generateEmailTemplate('payment_success_user', emailData);

      const mailOptions = {
        from: `"Roshini's Shop" <${process.env.EMAIL_USER}>`,
        to: orderData.customerEmail,
        subject: `Payment Confirmation - Order ${orderData.orderNumber || orderData.merchantTransactionId}`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment success email sent to user:', orderData.customerEmail);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send payment success email to user:', error);
      throw error;
    }
  }

  // Send payment notification email to admin
  async sendPaymentNotificationToAdmin(orderData) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const emailData = {
        orderNumber: orderData.orderNumber || orderData.merchantTransactionId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone || 'N/A',
        transactionId: orderData.transactionId,
        amount: orderData.amount.toLocaleString(),
        paymentMethod: 'PhonePe',
        paymentDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        shippingAddress: orderData.shippingAddress || 'Address on file',
        adminOrderUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/orders`
      };

      const htmlContent = this.generateEmailTemplate('payment_success_admin', emailData);

      const mailOptions = {
        from: `"Roshini's Shop System" <${process.env.EMAIL_USER}>`,
        to: this.adminEmail,
        subject: `🔔 New Payment Received - Order ${orderData.orderNumber || orderData.merchantTransactionId}`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment notification email sent to admin:', this.adminEmail);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send payment notification email to admin:', error);
      throw error;
    }
  }

  // Send payment failed email to user
  async sendPaymentFailedEmailToUser(orderData) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const emailData = {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber || orderData.merchantTransactionId,
        transactionId: orderData.transactionId,
        amount: orderData.amount.toLocaleString(),
        failureReason: orderData.responseMessage || 'Payment processing error',
        retryPaymentUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout?retry=${orderData.orderNumber || orderData.merchantTransactionId}`
      };

      const htmlContent = this.generateEmailTemplate('payment_failed_user', emailData);

      const mailOptions = {
        from: `"Roshini's Shop" <${process.env.EMAIL_USER}>`,
        to: orderData.customerEmail,
        subject: `Payment Failed - Order ${orderData.orderNumber || orderData.merchantTransactionId}`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment failed email sent to user:', orderData.customerEmail);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send payment failed email to user:', error);
      throw error;
    }
  }

  // Send bulk emails (for notifications to multiple recipients)
  async sendBulkEmails(emails) {
    const results = [];
    
    for (const emailData of emails) {
      try {
        const result = await this.transporter.sendMail(emailData);
        results.push({ success: true, messageId: result.messageId, to: emailData.to });
      } catch (error) {
        console.error(`Failed to send email to ${emailData.to}:`, error);
        results.push({ success: false, error: error.message, to: emailData.to });
      }
    }
    
    return results;
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      const testEmail = {
        from: `"Roshini's Shop Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send test email to self
        subject: 'Email Service Test - Roshini\'s Shop',
        html: `
          <h2>Email Service Test</h2>
          <p>This is a test email to verify the email service configuration.</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Service Status:</strong> ✅ Working</p>
        `
      };

      const result = await this.transporter.sendMail(testEmail);
      console.log('✅ Test email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Test email failed:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();