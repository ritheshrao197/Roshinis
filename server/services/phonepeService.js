const crypto = require('crypto');
const axios = require('axios');

class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID;
    this.merchantKey = process.env.PHONEPE_MERCHANT_KEY;
    this.saltKey = process.env.PHONEPE_SALT_KEY;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || 1;
    this.environment = process.env.PHONEPE_ENVIRONMENT || 'UAT';
    this.redirectUrl = process.env.PHONEPE_REDIRECT_URL;
    this.callbackUrl = process.env.PHONEPE_CALLBACK_URL;
    
    // Set base URL based on environment
    this.baseUrl = this.environment === 'PROD' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/hermes';
  }

  // Generate checksum for PhonePe API
  generateChecksum(payload) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const string = base64Payload + '/pg/v1/pay' + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return sha256 + '###' + this.saltIndex;
  }

  // Verify checksum from PhonePe response
  verifyChecksum(payload, checksum) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const string = base64Payload + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const expectedChecksum = sha256 + '###' + this.saltIndex;
    return checksum === expectedChecksum;
  }

  // Initiate payment
  async initiatePayment(orderData) {
    try {
      const {
        orderId,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        redirectUrl = this.redirectUrl
      } = orderData;

      // Create payment payload
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: orderId,
        amount: amount * 100, // Convert to paise
        redirectUrl: redirectUrl,
        redirectMode: 'POST',
        callbackUrl: this.callbackUrl,
        merchantUserId: customerEmail,
        mobileNumber: customerPhone,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // Generate checksum
      const checksum = this.generateChecksum(payload);
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

      // Make API call to PhonePe
      const response = await axios.post(`${this.baseUrl}/pg/v1/pay`, {
        request: base64Payload
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      });

      if (response.data.success) {
        return {
          success: true,
          paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
          transactionId: response.data.data.transactionId,
          merchantTransactionId: response.data.data.merchantTransactionId
        };
      } else {
        throw new Error(response.data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Payment initiation failed');
    }
  }

  // Verify payment status
  async verifyPayment(transactionId) {
    try {
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: transactionId,
        amount: 0, // Not required for verification
        redirectUrl: this.redirectUrl,
        redirectMode: 'POST',
        callbackUrl: this.callbackUrl
      };

      const checksum = this.generateChecksum(payload);
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

      const response = await axios.get(`${this.baseUrl}/pg/v1/status/${this.merchantId}/${transactionId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': this.merchantId
        }
      });

      if (response.data.success) {
        const paymentData = response.data.data;
        return {
          success: true,
          transactionId: paymentData.transactionId,
          merchantTransactionId: paymentData.merchantTransactionId,
          amount: paymentData.amount / 100, // Convert from paise
          status: paymentData.paymentState,
          responseCode: paymentData.responseCode,
          responseMessage: paymentData.responseMessage,
          bankCode: paymentData.bankCode,
          bankReferenceNumber: paymentData.bankReferenceNumber,
          upiTransactionId: paymentData.upiTransactionId,
          paymentInstrument: paymentData.paymentInstrument
        };
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('PhonePe payment verification error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Payment verification failed');
    }
  }

  // Handle webhook callback
  async handleWebhook(webhookData) {
    try {
      const { 
        merchantId,
        merchantTransactionId,
        transactionId,
        amount,
        paymentState,
        responseCode,
        responseMessage,
        checksum
      } = webhookData;

      // Verify webhook authenticity
      if (!this.verifyChecksum(webhookData, checksum)) {
        throw new Error('Invalid webhook checksum');
      }

      // Verify merchant ID
      if (merchantId !== this.merchantId) {
        throw new Error('Invalid merchant ID');
      }

      return {
        success: true,
        merchantTransactionId,
        transactionId,
        amount: amount / 100, // Convert from paise
        status: paymentState,
        responseCode,
        responseMessage,
        verified: true
      };
    } catch (error) {
      console.error('PhonePe webhook handling error:', error);
      throw error;
    }
  }

  // Refund payment
  async refundPayment(transactionId, amount, reason = 'Customer requested refund') {
    try {
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: transactionId,
        amount: amount * 100, // Convert to paise
        refundNote: reason
      };

      const checksum = this.generateChecksum(payload);
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

      const response = await axios.post(`${this.baseUrl}/pg/v1/refund`, {
        request: base64Payload
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      });

      if (response.data.success) {
        return {
          success: true,
          refundId: response.data.data.refundId,
          status: response.data.data.refundState,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Refund failed');
      }
    } catch (error) {
      console.error('PhonePe refund error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Refund failed');
    }
  }

  // Get payment instruments
  async getPaymentInstruments() {
    try {
      const response = await axios.get(`${this.baseUrl}/pg/v1/instruments`, {
        headers: {
          'Content-Type': 'application/json',
          'X-MERCHANT-ID': this.merchantId
        }
      });

      if (response.data.success) {
        return {
          success: true,
          instruments: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to get payment instruments');
      }
    } catch (error) {
      console.error('PhonePe get instruments error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get payment instruments');
    }
  }

  // Validate payment data
  validatePaymentData(orderData) {
    const required = ['orderId', 'amount', 'customerName', 'customerEmail', 'customerPhone'];
    const missing = required.filter(field => !orderData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (orderData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!orderData.customerEmail.includes('@')) {
      throw new Error('Invalid customer email');
    }

    if (!/^[0-9]{10}$/.test(orderData.customerPhone)) {
      throw new Error('Invalid customer phone number');
    }

    return true;
  }

  // Get payment status mapping
  getPaymentStatusMapping() {
    return {
      'PAYMENT_SUCCESS': 'completed',
      'PAYMENT_ERROR': 'failed',
      'PAYMENT_PENDING': 'pending',
      'PAYMENT_DECLINED': 'failed',
      'PAYMENT_CANCELLED': 'cancelled'
    };
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}

module.exports = new PhonePeService();
