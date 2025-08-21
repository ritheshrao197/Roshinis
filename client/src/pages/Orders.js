import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  ShoppingBag as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Schedule as PendingIcon,
  Cancel as CancelledIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024001',
          date: '2024-01-15',
          status: 'delivered',
          total: 2499,
          items: [
            { id: 1, name: 'Premium Product 1', quantity: 2, price: 999, image: 'https://picsum.photos/50/50?random=1' },
            { id: 2, name: 'Premium Product 2', quantity: 1, price: 501, image: 'https://picsum.photos/50/50?random=2' }
          ],
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          paymentMethod: 'PhonePe',
          estimatedDelivery: '2024-01-18',
          actualDelivery: '2024-01-17',
          trackingNumber: 'DLV123456789'
        },
        {
          id: 2,
          orderNumber: 'ORD-2024002',
          date: '2024-01-10',
          status: 'shipped',
          total: 1599,
          items: [
            { id: 3, name: 'Premium Product 3', quantity: 1, price: 1599, image: 'https://picsum.photos/50/50?random=3' }
          ],
          shippingAddress: '456 Oak Ave, Delhi, Delhi 110001',
          paymentMethod: 'PhonePe',
          estimatedDelivery: '2024-01-13',
          actualDelivery: null,
          trackingNumber: 'DLV987654321'
        },
        {
          id: 3,
          orderNumber: 'ORD-2024003',
          date: '2024-01-05',
          status: 'pending',
          total: 899,
          items: [
            { id: 4, name: 'Premium Product 4', quantity: 1, price: 899, image: 'https://picsum.photos/50/50?random=4' }
          ],
          shippingAddress: '789 Pine Rd, Bangalore, Karnataka 560001',
          paymentMethod: 'COD',
          estimatedDelivery: '2024-01-08',
          actualDelivery: null,
          trackingNumber: null
        },
        {
          id: 4,
          orderNumber: 'ORD-2024004',
          date: '2024-01-01',
          status: 'cancelled',
          total: 1299,
          items: [
            { id: 5, name: 'Premium Product 5', quantity: 1, price: 1299, image: 'https://picsum.photos/50/50?random=5' }
          ],
          shippingAddress: '321 Elm St, Chennai, Tamil Nadu 600001',
          paymentMethod: 'PhonePe',
          estimatedDelivery: '2024-01-04',
          actualDelivery: null,
          trackingNumber: null,
          cancellationReason: 'Changed my mind'
        }
      ];
      
      setOrders(mockOrders);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
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
        return <ShippingIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'cancelled':
        return <CancelledIcon />;
      default:
        return <OrderIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'recent' && new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'old' && new Date(order.date) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleTrackOrder = (trackingNumber) => {
    if (trackingNumber) {
      // In real app, redirect to tracking page or open tracking modal
      window.open(`https://www.delhivery.com/track/${trackingNumber}`, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to view your orders.
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
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Orders
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Date</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="recent">Last 30 Days</MenuItem>
                  <MenuItem value="old">Older</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders List */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <OrderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'No orders match your filters' 
                : 'No orders yet'}
            </Typography>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
              >
                Start Shopping
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        variant="outlined"
                      />
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        ₹{order.total.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Items */}
                  <Box sx={{ mb: 2 }}>
                    {order.items.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={item.image} alt={item.name} sx={{ mr: 2, width: 40, height: 40 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Order Details */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Shipping Address:</strong><br />
                        {order.shippingAddress}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Payment Method:</strong> {order.paymentMethod}<br />
                        <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                        {order.actualDelivery && (
                          <><br /><strong>Actual Delivery:</strong> {new Date(order.actualDelivery).toLocaleDateString()}</>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View Details
                    </Button>
                    
                    {order.trackingNumber && (
                      <Button
                        variant="outlined"
                        startIcon={<ShippingIcon />}
                        onClick={() => handleTrackOrder(order.trackingNumber)}
                      >
                        Track Order
                      </Button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <Button variant="outlined" color="success">
                        Write Review
                      </Button>
                    )}
                    
                    {order.status === 'pending' && (
                      <Button variant="outlined" color="error">
                        Cancel Order
                      </Button>
                    )}
                  </Box>

                  {/* Cancellation Reason */}
                  {order.status === 'cancelled' && order.cancellationReason && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>Cancellation Reason:</strong> {order.cancellationReason}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders;
