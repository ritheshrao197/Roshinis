import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Divider,
  Chip,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartSummary } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [checkoutStep, setCheckoutStep] = useState(0);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('phonepe');

  const cartSummary = getCartSummary();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    } else {
      removeFromCart(itemId);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleMoveToWishlist = (item) => {
    // TODO: Implement wishlist functionality
    removeFromCart(item.id);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckoutDialog(false);
    setCheckoutStep(0);
  };

  const handleCheckoutNext = () => {
    if (checkoutStep < 2) {
      setCheckoutStep(checkoutStep + 1);
    }
  };

  const handleCheckoutBack = () => {
    if (checkoutStep > 0) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement
    console.log('Placing order with:', {
      items: cartItems,
      shipping: shippingAddress,
      shippingMethod,
      paymentMethod,
      total: cartSummary.total
    });
    
    // For now, just clear cart and show success
    clearCart();
    setShowCheckoutDialog(false);
    setCheckoutStep(0);
    navigate('/order-confirmation');
  };

  const renderCartItem = (item) => (
    <Card key={item.id} sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} sm={3} md={2}>
          <CardMedia
            component="img"
            height="120"
            image={item.image}
            alt={item.name}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        
        <Grid item xs={8} sm={9} md={10}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Price: ₹{item.price.toLocaleString()}
                </Typography>

                {/* Quantity Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <TextField
                    size="small"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        handleQuantityChange(item.id, value);
                      }
                    }}
                    inputProps={{
                      min: 1,
                      style: { textAlign: 'center', width: '60px' }
                    }}
                  />
                  
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Item Total */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  Total: ₹{(item.price * item.quantity).toLocaleString()}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove from cart"
                >
                  <DeleteIcon />
                </IconButton>
                
                <IconButton
                  color="primary"
                  onClick={() => handleMoveToWishlist(item)}
                  title="Move to wishlist"
                >
                  <FavoriteBorderIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const renderCheckoutSteps = () => {
    const steps = ['Shipping Address', 'Shipping Method', 'Payment & Review'];

    return (
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={checkoutStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  const renderCheckoutContent = () => {
    switch (checkoutStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    city: e.target.value
                  }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    state: e.target.value
                  }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress(prev => ({
                    ...prev,
                    pincode: e.target.value
                  }))}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <FormControlLabel
                  key="standard"
                  value="standard"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body1">Standard Delivery</Typography>
                        <Typography variant="body2" color="text.secondary">
                          3-5 business days
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="primary">
                        {cartSummary.shipping > 0 ? `₹${cartSummary.shipping}` : 'Free'}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  key="express"
                  value="express"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body1">Express Delivery</Typography>
                        <Typography variant="body2" color="text.secondary">
                          1-2 business days
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="primary">
                        ₹{cartSummary.shipping + 200}
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method & Review
            </Typography>
            
            {/* Payment Method Selection */}
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    key="phonepe"
                    value="phonepe"
                    control={<Radio />}
                    label="PhonePe (UPI, Cards, Net Banking)"
                  />
                  <FormControlLabel
                    key="cod"
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Order Summary */}
            <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal ({totalItems} items):</Typography>
                <Typography>₹{cartSummary.subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>
                  {shippingMethod === 'express' ? `₹${cartSummary.shipping + 200}` : 
                   cartSummary.shipping > 0 ? `₹${cartSummary.shipping}` : 'Free'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>₹{cartSummary.tax.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{cartSummary.total.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
            startIcon={<ArrowBackIcon />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </Box>

          {cartItems.map(renderCartItem)}

          {/* Cart Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* Cart Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({totalItems} items):</Typography>
                  <Typography>₹{cartSummary.subtotal.toLocaleString()}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>
                    {cartSummary.shipping > 0 ? `₹${cartSummary.shipping}` : 'Free'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>₹{cartSummary.tax.toLocaleString()}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{cartSummary.total.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleProceedToCheckout}
                startIcon={<PaymentIcon />}
                sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<ShippingIcon />}
                    label="Free Shipping"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Secure Payment"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Secure payments via PhonePe
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <Dialog
        open={showCheckoutDialog}
        onClose={handleCheckoutClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Checkout
        </DialogTitle>
        <DialogContent>
          {renderCheckoutSteps()}
          {renderCheckoutContent()}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCheckoutClose}
            variant="outlined"
          >
            Cancel
          </Button>
          
          {checkoutStep > 0 && (
            <Button
              onClick={handleCheckoutBack}
              variant="outlined"
            >
              Back
            </Button>
          )}
          
          {checkoutStep < 2 ? (
            <Button
              onClick={handleCheckoutNext}
              variant="contained"
              disabled={
                (checkoutStep === 0 && (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address)) ||
                (checkoutStep === 1 && !shippingMethod)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handlePlaceOrder}
              variant="contained"
              disabled={!paymentMethod}
              startIcon={<CheckCircleIcon />}
            >
              Place Order
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
