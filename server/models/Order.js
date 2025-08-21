const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    variant: {
      name: String,
      option: String
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    rate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative']
    }
  },
  shipping: {
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    address: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
      },
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    tracking: {
      number: String,
      carrier: String,
      status: String,
      estimatedDelivery: Date,
      actualDelivery: Date
    }
  },
  discount: {
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  payment: {
    method: {
      type: String,
      enum: ['phonepe', 'cod', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    gateway: String,
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  status: {
    current: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    history: [{
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  notes: {
    customer: String,
    internal: String
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancellation: {
    reason: String,
    requestedAt: Date,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  return: {
    reason: String,
    requestedAt: Date,
    returnedAt: Date,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'shipping.tracking.number': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Apply discount
  let discountAmount = 0;
  if (this.discount.amount > 0) {
    if (this.discount.type === 'percentage') {
      discountAmount = (this.subtotal * this.discount.amount) / 100;
    } else {
      discountAmount = this.discount.amount;
    }
  }
  
  // Calculate tax
  const taxAmount = (this.subtotal - discountAmount) * (this.tax.rate / 100);
  this.tax.amount = taxAmount;
  
  // Calculate final total
  this.total = this.subtotal - discountAmount + taxAmount + this.shipping.cost;
  
  return this;
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status.current = newStatus;
  this.status.history.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // Update timestamps for specific statuses
  if (newStatus === 'shipped') {
    this.status.history.find(h => h.status === 'shipped').timestamp = new Date();
  } else if (newStatus === 'delivered') {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Method to add shipping tracking
orderSchema.methods.addTracking = function(trackingNumber, carrier, estimatedDelivery) {
  this.shipping.tracking.number = trackingNumber;
  this.shipping.tracking.carrier = carrier;
  this.shipping.tracking.estimatedDelivery = estimatedDelivery;
  this.shipping.tracking.status = 'shipped';
  return this.save();
};

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return {
    orderNumber: this.orderNumber,
    total: this.total,
    status: this.status.current,
    itemCount: this.items.length,
    createdAt: this.createdAt
  };
});

module.exports = mongoose.model('Order', orderSchema);
