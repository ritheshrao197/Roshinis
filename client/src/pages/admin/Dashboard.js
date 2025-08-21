import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Alert,
  Skeleton,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  TrendingUp as RevenueIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard data
      const mockStats = {
        totalOrders: 1247,
        totalRevenue: 2847500,
        totalProducts: 89,
        totalUsers: 456,
        pendingOrders: 23,
        shippedOrders: 45,
        deliveredOrders: 1179,
        cancelledOrders: 12,
        monthlyRevenue: [120000, 150000, 180000, 200000, 220000, 250000, 280000, 300000, 320000, 350000, 380000, 400000],
        topCategories: [
          { name: 'Electronics', count: 34, revenue: 850000 },
          { name: 'Fashion', count: 28, revenue: 650000 },
          { name: 'Home & Garden', count: 22, revenue: 450000 },
          { name: 'Sports', count: 18, revenue: 350000 },
          { name: 'Books', count: 15, revenue: 250000 }
        ]
      };

      const mockRecentOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024001',
          customerName: 'John Doe',
          amount: 2499,
          status: 'pending',
          date: '2024-01-15T10:30:00',
          items: 3
        },
        {
          id: 2,
          orderNumber: 'ORD-2024002',
          customerName: 'Sarah Smith',
          amount: 1599,
          status: 'shipped',
          date: '2024-01-15T09:15:00',
          items: 2
        },
        {
          id: 3,
          orderNumber: 'ORD-2024003',
          customerName: 'Mike Johnson',
          amount: 899,
          status: 'delivered',
          date: '2024-01-15T08:45:00',
          items: 1
        },
        {
          id: 4,
          orderNumber: 'ORD-2024004',
          customerName: 'Emily Brown',
          amount: 3299,
          status: 'pending',
          date: '2024-01-15T08:20:00',
          items: 4
        },
        {
          id: 5,
          orderNumber: 'ORD-2024005',
          customerName: 'David Wilson',
          amount: 1899,
          status: 'processing',
          date: '2024-01-15T07:55:00',
          items: 2
        }
      ];
      
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
      console.error('Error fetching dashboard data:', err);
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
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, onClick }) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 4 } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access the admin dashboard.
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

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Access denied. Admin privileges required.
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders?.toLocaleString()}
            subtitle="All time"
            icon={<OrdersIcon />}
            color="primary"
            onClick={() => navigate('/admin/orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue / 100000).toFixed(1)}L`}
            subtitle="All time"
            icon={<RevenueIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts?.toLocaleString()}
            subtitle="Active products"
            icon={<ProductsIcon />}
            color="info"
            onClick={() => navigate('/admin/products')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers?.toLocaleString()}
            subtitle="Registered users"
            icon={<UsersIcon />}
            color="warning"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
      </Grid>

      {/* Order Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Status Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {stats?.pendingOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {stats?.shippedOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Shipped</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {stats?.deliveredOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Delivered</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                      {stats?.cancelledOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Cancelled</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/admin/products/new')}
                  fullWidth
                >
                  Add Product
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<OrdersIcon />}
                  onClick={() => navigate('/admin/orders')}
                  fullWidth
                >
                  View Orders
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UsersIcon />}
                  onClick={() => navigate('/admin/users')}
                  fullWidth
                >
                  Manage Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders and Top Categories */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Orders</Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/admin/orders')}
                >
                  View All
                </Button>
              </Box>
              
              {recentOrders.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent orders
                </Typography>
              ) : (
                <List>
                  {recentOrders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {order.customerName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={order.orderNumber}
                          secondary={`${order.customerName} • ${order.items} items`}
                        />
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            ₹{order.amount.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          sx={{ ml: 1 }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Categories</Typography>
              {stats?.topCategories?.map((category, index) => (
                <Box key={category.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      ₹{(category.revenue / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.revenue / stats.topCategories[0].revenue) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {category.count} products
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
