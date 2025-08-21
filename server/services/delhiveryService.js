const axios = require('axios');

class DelhiveryService {
  constructor() {
    this.apiKey = process.env.DELHIVERY_API_KEY;
    this.clientCode = process.env.DELHIVERY_CLIENT_CODE;
    this.warehouseId = process.env.DELHIVERY_WAREHOUSE_ID;
    this.baseUrl = process.env.DELHIVERY_BASE_URL || 'https://staging-express.delhivery.com';
  }

  // Set default headers for all API calls
  getHeaders() {
    return {
      'Authorization': `Token ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Create new shipment
  async createShipment(shipmentData) {
    try {
      const {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        items,
        weight,
        dimensions,
        codAmount = 0,
        declaredValue = 0
      } = shipmentData;

      // Validate required fields
      this.validateShipmentData(shipmentData);

      const payload = {
        shipment_details: {
          waybill: null, // Delhivery will generate
          order: orderNumber,
          order_date: new Date().toISOString().split('T')[0],
          total_amount: declaredValue,
          cod_amount: codAmount,
          order_type: codAmount > 0 ? 'COD' : 'Prepaid',
          shipment_weight: weight || 0.5,
          dimension: {
            length: dimensions?.length || 10,
            breadth: dimensions?.width || 10,
            height: dimensions?.height || 10
          }
        },
        pickup_location: {
          name: process.env.COMPANY_NAME || 'Your Company',
          address: process.env.COMPANY_ADDRESS || 'Company Address',
          city: process.env.COMPANY_CITY || 'Mumbai',
          state: process.env.COMPANY_STATE || 'Maharashtra',
          pincode: process.env.COMPANY_PINCODE || '400001',
          phone: process.env.COMPANY_PHONE || '1234567890',
          email: process.env.COMPANY_EMAIL || 'info@company.com'
        },
        delivery_details: {
          name: customerName,
          address: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: customerPhone,
          email: customerEmail
        },
        package_details: {
          name: items.map(item => item.name).join(', '),
          quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          description: items.map(item => `${item.name} (${item.quantity})`).join(', ')
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/api/pin/create-order/`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        return {
          success: true,
          waybill: response.data.waybill,
          orderNumber: orderNumber,
          trackingUrl: `https://www.delhivery.com/track/${response.data.waybill}`,
          message: 'Shipment created successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Delhivery create shipment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create shipment');
    }
  }

  // Track shipment
  async trackShipment(waybill) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/pin/track/${waybill}/`,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        const trackingData = response.data.data;
        return {
          success: true,
          waybill: waybill,
          status: this.mapTrackingStatus(trackingData.status),
          currentLocation: trackingData.current_location,
          estimatedDelivery: trackingData.estimated_delivery,
          deliveredAt: trackingData.delivered_at,
          timeline: trackingData.timeline || [],
          message: 'Tracking information retrieved successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to track shipment');
      }
    } catch (error) {
      console.error('Delhivery track shipment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to track shipment');
    }
  }

  // Check pin-code serviceability
  async checkPinCode(pincode) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/pin/serviceability/${pincode}/`,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        const data = response.data.data;
        return {
          success: true,
          pincode: pincode,
          serviceable: data.serviceable || false,
          city: data.city,
          state: data.state,
          deliveryTime: data.delivery_time,
          cashOnDelivery: data.cod || false,
          message: data.serviceable ? 'Pin-code is serviceable' : 'Pin-code is not serviceable'
        };
      } else {
        throw new Error(response.data.message || 'Failed to check pin-code');
      }
    } catch (error) {
      console.error('Delhivery pin-code check error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to check pin-code');
    }
  }

  // Get shipping rates
  async getShippingRates(fromPincode, toPincode, weight, codAmount = 0) {
    try {
      const payload = {
        from_pincode: fromPincode,
        to_pincode: toPincode,
        weight: weight,
        cod_amount: codAmount
      };

      const response = await axios.post(
        `${this.baseUrl}/api/pin/rate/`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        const rates = response.data.data;
        return {
          success: true,
          fromPincode,
          toPincode,
          weight,
          rates: rates.map(rate => ({
            service: rate.service,
            deliveryTime: rate.delivery_time,
            cost: rate.cost,
            codCharge: rate.cod_charge || 0,
            totalCost: rate.cost + (rate.cod_charge || 0)
          })),
          message: 'Shipping rates retrieved successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to get shipping rates');
      }
    } catch (error) {
      console.error('Delhivery shipping rates error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get shipping rates');
    }
  }

  // Cancel shipment
  async cancelShipment(waybill, reason = 'Customer requested cancellation') {
    try {
      const payload = {
        waybill: waybill,
        reason: reason
      };

      const response = await axios.post(
        `${this.baseUrl}/api/pin/cancel-order/`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        return {
          success: true,
          waybill: waybill,
          message: 'Shipment cancelled successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to cancel shipment');
      }
    } catch (error) {
      console.error('Delhivery cancel shipment error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel shipment');
    }
  }

  // Get warehouse details
  async getWarehouseDetails() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/pin/warehouse/${this.warehouseId}/`,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        return {
          success: true,
          warehouse: response.data.data,
          message: 'Warehouse details retrieved successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to get warehouse details');
      }
    } catch (error) {
      console.error('Delhivery warehouse details error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get warehouse details');
    }
  }

  // Validate shipment data
  validateShipmentData(shipmentData) {
    const required = [
      'orderNumber', 'customerName', 'customerPhone', 
      'customerEmail', 'shippingAddress', 'items'
    ];
    
    const missing = required.filter(field => !shipmentData[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!shipmentData.shippingAddress.pincode) {
      throw new Error('Shipping address pincode is required');
    }

    if (!/^[0-9]{6}$/.test(shipmentData.shippingAddress.pincode)) {
      throw new Error('Invalid pincode format');
    }

    if (!/^[0-9]{10}$/.test(shipmentData.customerPhone)) {
      throw new Error('Invalid customer phone number');
    }

    if (!shipmentData.customerEmail.includes('@')) {
      throw new Error('Invalid customer email');
    }

    if (!Array.isArray(shipmentData.items) || shipmentData.items.length === 0) {
      throw new Error('Items array is required and cannot be empty');
    }

    return true;
  }

  // Map tracking status to readable format
  mapTrackingStatus(status) {
    const statusMap = {
      'In Transit': 'in_transit',
      'Delivered': 'delivered',
      'Out for Delivery': 'out_for_delivery',
      'Picked Up': 'picked_up',
      'In Transit - Out for Delivery': 'out_for_delivery',
      'Delivered - Signed by': 'delivered',
      'Exception': 'exception',
      'Returned': 'returned'
    };

    return statusMap[status] || status.toLowerCase().replace(/\s+/g, '_');
  }

  // Format weight for API
  formatWeight(weight) {
    if (typeof weight === 'number') {
      return Math.max(0.1, weight); // Minimum 100g
    }
    return 0.5; // Default 500g
  }

  // Format dimensions for API
  formatDimensions(dimensions) {
    if (!dimensions) {
      return { length: 10, width: 10, height: 10 };
    }

    return {
      length: Math.max(1, dimensions.length || 10),
      width: Math.max(1, dimensions.width || 10),
      height: Math.max(1, dimensions.height || 10)
    };
  }

  // Get estimated delivery date
  getEstimatedDelivery(fromPincode, toPincode) {
    // This is a simplified estimation
    // In production, you would use Delhivery's rate API to get accurate delivery times
    const baseDays = 3;
    const fromState = this.getStateFromPincode(fromPincode);
    const toState = this.getStateFromPincode(toPincode);
    
    if (fromState === toState) {
      return baseDays;
    } else {
      return baseDays + 2;
    }
  }

  // Helper method to get state from pincode (simplified)
  getStateFromPincode(pincode) {
    // This is a simplified mapping
    // In production, you would use a proper pincode database
    const pincodeMap = {
      '11': 'Delhi',
      '12': 'Haryana',
      '13': 'Punjab',
      '20': 'Uttar Pradesh',
      '30': 'Rajasthan',
      '40': 'Gujarat',
      '50': 'Maharashtra',
      '60': 'Tamil Nadu',
      '70': 'Karnataka',
      '80': 'Andhra Pradesh'
    };

    const prefix = pincode.substring(0, 2);
    return pincodeMap[prefix] || 'Other';
  }
}

module.exports = new DelhiveryService();
