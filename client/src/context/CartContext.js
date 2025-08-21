import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.product._id === product._id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          product,
          quantity,
          price: product.price,
          total: product.price * quantity,
          variant,
          addedAt: new Date().toISOString()
        };
        return [...prevItems, newItem];
      }
    });

    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId, variant = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.product._id === productId && 
          JSON.stringify(item.variant) === JSON.stringify(variant))
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.product._id === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant)) {
          return {
            ...item,
            quantity,
            total: item.price * quantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId, variant = null) => {
    return cartItems.find(item => 
      item.product._id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );
  };

  const isInCart = (productId, variant = null) => {
    return cartItems.some(item => 
      item.product._id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );
  };

  const getCartSummary = () => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: getCartItemCount()
    };
  };

  const moveToWishlist = (productId, variant = null) => {
    const item = getCartItem(productId, variant);
    if (item) {
      // TODO: Implement wishlist functionality
      removeFromCart(productId, variant);
      toast.success('Item moved to wishlist');
    }
  };

  const saveForLater = (productId, variant = null) => {
    const item = getCartItem(productId, variant);
    if (item) {
      // TODO: Implement save for later functionality
      removeFromCart(productId, variant);
      toast.success('Item saved for later');
    }
  };

  const applyCoupon = (couponCode) => {
    // TODO: Implement coupon functionality
    toast.info('Coupon functionality coming soon!');
  };

  const removeCoupon = () => {
    // TODO: Implement coupon removal
    toast.info('Coupon removed');
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    return true;
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    isInCart,
    getCartSummary,
    moveToWishlist,
    saveForLater,
    applyCoupon,
    removeCoupon,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
