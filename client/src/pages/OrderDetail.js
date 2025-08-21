import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Alert,
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
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Schedule as PendingIcon,
  Cancel as CancelledIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const mockOrder = {
        id: parseInt(id),
        orderNumber: 'ORD-2024001',
        date: '2024-01-15',
        status: 'delivered',
        total: 2499,
        subtotal: 2398,
        shipping: 99,
        tax: 2,
        items: [
          { 
            id: 1, 
            name: 'Premium Product 1', 
            quantity: 2, 
            price: 999, 
            image: 'https://picsum.photos/100/100?random=1',
            description: 'High-quality premium product with excellent features'
          },
          { 
            id: 2, 
            name: 'Premium Product 2', 
            quantity: 1, 
            price: 501, 
            image: 'https://picsum.photos/100/100?random=2',
            description: 'Another amazing product for your needs'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          phone: '+91 98765 43210',
          email: 'john.doe@example.com'
        },
        paymentMethod: 'PhonePe',
        paymentStatus: 'paid',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17',
        trackingNumber: 'DLV123456789',
        orderHistory: [
          {
            date: '2024-01-15T10:30:00',
            status: 'pending',
            description: 'Order placed successfully',
            location: 'Mumbai, Maharashtra'
          },
          {
            date: '2024-01-15T14:00:00',
            status: 'confirmed',
            description: 'Order confirmed and payment received',
            location: 'Mumbai, Maharashtra'
          },
          {
            date: '2024-01-16T09:00:00',
            status: 'processing',
            description: 'Order is being processed and packed',
            location: 'Mumbai, Maharashtra'
          },
          {
            date: '2024-01-16T16:00:00',
            status: 'shipped',
            description: 'Order shipped via Delhivery Express',
            location: 'Mumbai, Maharashtra'
          },
          {
            date: '2024-01-17T11:00:00',
            status: 'out_for_delivery',
            description: 'Out for delivery',
            location: 'Mumbai, Maharashtra'
          },
          {
            date: '2024-01-17T15:30:00',
            status: 'delivered',
            description: 'Order delivered successfully',
            location: 'Mumbai, Maharashtra'
          }
        ]
      };
      
      setOrder(mockOrder);
      setError('');
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'out_for_delivery':
        return 'info';
      case 'processing':
      case 'confirmed':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <DeliveredIcon />;
      case 'shipped':
      case 'out_for_delivery':
        return <ShippingIcon />;
      case 'processing':
      case 'confirmed':
        return <PendingIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'cancelled':
        return <CancelledIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'processing':
        return 'Processing';
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleTrackOrder = () => {
    if (order?.trackingNumber) {
      window.open(`https://www.delhivery.com/track/${order.trackingNumber}`, '_blank');
    }
  };

  const handleDownloadInvoice = () => {
    // In real app, generate and download PDF invoice
    alert('Invoice download feature will be implemented here');
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order?.orderNumber}`,
        text: `Check out my order: ${order?.orderNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to view order details.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareOrder}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Order Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order {order.orderNumber}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Placed on {new Date(order.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={getStatusText(order.status)}
                  color={getStatusColor(order.status)}
                  variant="filled"
                  size="large"
                />
                {order.trackingNumber && (
                  <Chip
                    label={`Tracking: ${order.trackingNumber}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                ₹{order.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          {/* Order Items */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              <List>
                {order.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={item.image} alt={item.name} sx={{ width: 60, height: 60 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={item.description}
                        sx={{ flex: 1 }}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < order.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

                     {/* Order Timeline */}
           <Card sx={{ mb: 4 }}>
             <CardContent>
               <Typography variant="h6" gutterBottom>Order Timeline</Typography>
               <List>
                 {order.orderHistory.map((history, index) => (
                   <ListItem key={index} sx={{ px: 0 }}>
                     <ListItemAvatar>
                       <Avatar sx={{ bgcolor: `${getStatusColor(history.status)}.main` }}>
                         {getStatusIcon(history.status)}
                       </Avatar>
                     </ListItemAvatar>
                     <ListItemText
                       primary={
                         <Box>
                           <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                             {getStatusText(history.status)}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             {new Date(history.date).toLocaleDateString()} at {new Date(history.date).toLocaleTimeString()}
                           </Typography>
                         </Box>
                       }
                       secondary={
                         <Box sx={{ mt: 1 }}>
                           <Typography variant="body2">
                             {history.description}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                             {history.location}
                           </Typography>
                         </Box>
                       }
                     />
                   </ListItem>
                 ))}
               </List>
             </CardContent>
           </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Shipping Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shipping Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                  {order.shippingAddress.country}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">{order.shippingAddress.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">{order.shippingAddress.email}</Typography>
                </Box>
              </Box>

              {order.trackingNumber && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShippingIcon />}
                  onClick={handleTrackOrder}
                  sx={{ mt: 2 }}
                >
                  Track Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body2">{order.paymentMethod}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Status
                </Typography>
                <Chip
                  label={order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{order.subtotal.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">₹{order.shipping.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2">₹{order.tax.toLocaleString()}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    ₹{order.total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {order.estimatedDelivery && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body2">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
