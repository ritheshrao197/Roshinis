import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, fetch order details from API or get from location state
    // For now, create mock order details
    setTimeout(() => {
      const mockOrder = {
        orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 1,
            name: 'Premium Product 1',
            price: 2499,
            quantity: 2,
            image: 'https://picsum.photos/100/100?random=1'
          },
          {
            id: 2,
            name: 'Premium Product 2',
            price: 1899,
            quantity: 1,
            image: 'https://picsum.photos/100/100?random=2'
          }
        ],
        shipping: {
          fullName: user?.name || 'John Doe',
          phone: user?.phone || '+91 98765 43210',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        payment: {
          method: 'PhonePe',
          status: 'Paid',
          transactionId: `TXN-${Date.now().toString().slice(-8)}`
        },
        totals: {
          subtotal: 5897,
          shipping: 0,
          tax: 589,
          total: 6486
        },
        status: 'Confirmed',
        trackingNumber: `TRK-${Date.now().toString().slice(-8)}`
      };
      
      setOrderDetails(mockOrder);
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    console.log('Downloading invoice for order:', orderDetails.orderNumber);
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${orderDetails.orderNumber}`,
        text: `I just placed an order for ₹${orderDetails.totals.total.toLocaleString()} on your e-commerce platform!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleEmailReceipt = () => {
    // TODO: Implement email receipt
    console.log('Sending email receipt for order:', orderDetails.orderNumber);
  };

  const renderOrderSteps = () => {
    const steps = [
      { label: 'Order Placed', icon: <CheckCircleIcon />, completed: true },
      { label: 'Payment Confirmed', icon: <PaymentIcon />, completed: true },
      { label: 'Processing', icon: <ShoppingBagIcon />, completed: false },
      { label: 'Shipped', icon: <ShippingIcon />, completed: false },
      { label: 'Delivered', icon: <CheckCircleIcon />, completed: false }
    ];

    return (
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label} completed={step.completed}>
              <StepLabel
                StepIconComponent={() => (
                  <Box sx={{ color: step.completed ? 'success.main' : 'text.disabled' }}>
                    {step.icon}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  const renderOrderItems = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Items
        </Typography>
        <List>
          {orderDetails.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={`Quantity: ${item.quantity}`}
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Typography>
              </ListItem>
              {index < orderDetails.items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderOrderSummary = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {orderDetails.orderNumber}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Estimated Delivery
              </Typography>
              <Typography variant="body1">
                {new Date(orderDetails.estimatedDelivery).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {orderDetails.payment.method}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Status
              </Typography>
              <Chip
                label={orderDetails.payment.status}
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tracking Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {orderDetails.trackingNumber}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderShippingDetails = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Shipping Address
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <LocationIcon color="action" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {orderDetails.shipping.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderDetails.shipping.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.pincode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderDetails.shipping.country}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📞 {orderDetails.shipping.phone}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPriceBreakdown = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Price Breakdown
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>₹{orderDetails.totals.subtotal.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Shipping:</Typography>
            <Typography>
              {orderDetails.totals.shipping > 0 ? `₹${orderDetails.totals.shipping}` : 'Free'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax:</Typography>
            <Typography>₹{orderDetails.totals.tax.toLocaleString()}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total:
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ₹{orderDetails.totals.total.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Processing your order...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Order details not found. Please check your order history.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/orders')}
        >
          View Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
            startIcon={<ShoppingBagIcon />}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleViewOrders}
            startIcon={<ReceiptIcon />}
          >
            View Orders
          </Button>
        </Box>
      </Box>

      {/* Order Progress */}
      {renderOrderSteps()}

      <Grid container spacing={4}>
        {/* Left Column - Order Details */}
        <Grid item xs={12} lg={8}>
          {renderOrderItems()}
          {renderOrderSummary()}
          {renderShippingDetails()}
        </Grid>

        {/* Right Column - Price & Actions */}
        <Grid item xs={12} lg={4}>
          {renderPriceBreakdown()}

          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShareIcon />}
                  onClick={handleShareOrder}
                >
                  Share Order
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={handleEmailReceipt}
                >
                  Email Receipt
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Our customer support team is here to help you with any questions.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">+91 1800-123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">support@example.com</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Next Steps */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          What's Next?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You'll receive email updates about your order status and tracking information.
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Order Updates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get email notifications about your order status and delivery updates.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <ShippingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Your Order
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use your tracking number to monitor your package in real-time.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Easy Returns
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Not satisfied? We offer hassle-free returns within 30 days.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinueShopping}
          startIcon={<ArrowForwardIcon />}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Start Shopping Again
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;
