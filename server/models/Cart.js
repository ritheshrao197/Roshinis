const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subtotal: {
    type: Number,
    default: 0,
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
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  itemCount: {
    type: Number,
    default: 0,
    min: [0, 'Item count cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price, variant = null) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].total = this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
    this.items[existingItemIndex].addedAt = new Date();
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      total: quantity * price,
      variant,
      addedAt: new Date()
    });
  }

  this.lastUpdated = new Date();
  return this.calculateTotals();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, variant = null) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() && 
      JSON.stringify(item.variant) === JSON.stringify(variant))
  );
  
  this.lastUpdated = new Date();
  return this.calculateTotals();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, variant = null) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId, variant);
    }
    
    item.quantity = quantity;
    item.total = quantity * item.price;
    item.addedAt = new Date();
    
    this.lastUpdated = new Date();
    return this.calculateTotals();
  }
  
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.lastUpdated = new Date();
  return this.calculateTotals();
};

// Method to calculate totals
cartSchema.methods.calculateTotals = function() {
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
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

// Method to apply discount
cartSchema.methods.applyDiscount = function(code, amount, type = 'fixed') {
  this.discount.code = code;
  this.discount.amount = amount;
  this.discount.type = type;
  
  return this.calculateTotals();
};

// Method to remove discount
cartSchema.methods.removeDiscount = function() {
  this.discount.code = null;
  this.discount.amount = 0;
  this.discount.type = 'fixed';
  
  return this.calculateTotals();
};

// Method to update shipping address
cartSchema.methods.updateShippingAddress = function(address) {
  this.shipping.address = address;
  return this;
};

// Method to update shipping method
cartSchema.methods.updateShippingMethod = function(method, cost) {
  this.shipping.method = method;
  this.shipping.cost = cost || 0;
  return this.calculateTotals();
};

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    itemCount: this.itemCount,
    subtotal: this.subtotal,
    tax: this.tax.amount,
    shipping: this.shipping.cost,
    discount: this.discount.amount,
    total: this.total
  };
});

// Pre-save middleware to update lastUpdated
cartSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
