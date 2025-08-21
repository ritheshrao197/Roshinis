import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Box,
  Divider,
  Alert,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const steps = ['Cart Review', 'Shipping Details', 'Payment', 'Order Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('phonepe');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingChange = (field) => (event) => {
    setShippingData({
      ...shippingData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Simulate order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to confirmation
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `ORD-${Date.now()}`,
          estimatedDelivery: '3-5 business days'
        }
      });
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Cart Review</Typography>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="h6" color="primary">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                ₹{getCartTotal().toLocaleString()}
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Shipping Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={shippingData.firstName}
                  onChange={handleShippingChange('firstName')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={shippingData.lastName}
                  onChange={handleShippingChange('lastName')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={shippingData.email}
                  onChange={handleShippingChange('email')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={shippingData.phone}
                  onChange={handleShippingChange('phone')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={shippingData.address}
                  onChange={handleShippingChange('address')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingData.city}
                  onChange={handleShippingChange('city')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={shippingData.state}
                  onChange={handleShippingChange('state')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={shippingData.pincode}
                  onChange={handleShippingChange('pincode')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={shippingData.country}
                  onChange={handleShippingChange('country')}
                  required
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Shipping Method</Typography>
              <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>Standard Delivery</span>
                      <span>₹99 (3-5 business days)</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="express"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>Express Delivery</span>
                      <span>₹199 (1-2 business days)</span>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel
                value="phonepe"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="PhonePe" color="primary" variant="outlined" />
                    <span>Pay with PhonePe (UPI, Cards, Net Banking)</span>
                  </Box>
                }
              />
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="COD" color="secondary" variant="outlined" />
                    <span>Cash on Delivery</span>
                  </Box>
                }
              />
            </RadioGroup>
            
            {paymentMethod === 'phonepe' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You will be redirected to PhonePe to complete your payment securely.
              </Alert>
            )}
            
            {paymentMethod === 'cod' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Cash on Delivery is available for orders up to ₹2000. Additional charges may apply.
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Order Review</Typography>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Shipping Address</Typography>
              <Typography variant="body2">
                {shippingData.firstName} {shippingData.lastName}<br />
                {shippingData.address}<br />
                {shippingData.city}, {shippingData.state} {shippingData.pincode}<br />
                {shippingData.country}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Order Summary</Typography>
              <List dense>
                {cartItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{getCartTotal().toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Shipping:</Typography>
                <Typography>₹{shippingMethod === 'express' ? '199' : '99'}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ₹{(getCartTotal() + (shippingMethod === 'express' ? 199 : 99)).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
            
            <Alert severity="info">
              By placing this order, you agree to our terms and conditions and privacy policy.
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to continue with checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          startIcon={<ArrowBackIcon />}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your cart is empty. Add some products to continue with checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          startIcon={<ArrowBackIcon />}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {getStepContent(activeStep)}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <List dense>
                {cartItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{getCartTotal().toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>₹{shippingMethod === 'express' ? '199' : '99'}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{(getCartTotal() + (shippingMethod === 'express' ? 199 : 99)).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading ? <LoadingSpinner size={20} /> : <CheckIcon />}
              size="large"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Checkout;
