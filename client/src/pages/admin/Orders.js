import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
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
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: '',
    status: 'pending',
    paymentMethod: 'PhonePe',
    paymentStatus: 'pending',
    shippingAddress: '',
    items: []
  });

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Try to fetch from admin orders endpoint first
      try {
        const response = await axios.get('/api/orders/admin/all');
        if (response.data.success) {
          setOrders(response.data.orders || []);
          setError('');
          console.log('✅ Admin orders loaded from API:', response.data.orders?.length || 0);
          return;
        }
      } catch (apiError) {
        console.log('⚠️  Admin orders API not available, using mock data');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced mock orders data
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024001',
          customerName: 'John Doe',
          customerEmail: 'john.doe@example.com',
          customerPhone: '+91 98765 43210',
          amount: 2499,
          status: 'pending',
          date: '2024-01-15T10:30:00',
          items: 3,
          paymentMethod: 'PhonePe',
          paymentStatus: 'paid',
          shippingAddress: '123 Main St, City, State 12345'
        },
        {
          id: 2,
          orderNumber: 'ORD-2024002',
          customerName: 'Sarah Smith',
          customerEmail: 'sarah.smith@example.com',
          customerPhone: '+91 98765 43211',
          amount: 1599,
          status: 'shipped',
          date: '2024-01-15T09:15:00',
          items: 2,
          paymentMethod: 'PhonePe',
          paymentStatus: 'paid',
          shippingAddress: '456 Oak Ave, Town, State 54321'
        },
        {
          id: 3,
          orderNumber: 'ORD-2024003',
          customerName: 'Mike Johnson',
          customerEmail: 'mike.johnson@example.com',
          customerPhone: '+91 98765 43212',
          amount: 899,
          status: 'delivered',
          date: '2024-01-15T08:45:00',
          items: 1,
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          shippingAddress: '789 Pine Rd, Village, State 98765'
        },
        {
          id: 4,
          orderNumber: 'ORD-2024004',
          customerName: 'Emily Brown',
          customerEmail: 'emily.brown@example.com',
          customerPhone: '+91 98765 43213',
          amount: 3299,
          status: 'processing',
          date: '2024-01-14T15:20:00',
          items: 5,
          paymentMethod: 'PhonePe',
          paymentStatus: 'paid',
          shippingAddress: '321 Elm St, City, State 11111'
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (order.status?.current || order.status) === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'recent' && new Date(order.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'old' && new Date(order.date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'success' : 'warning';
  };

  const handleAdd = () => {
    setFormData({
      orderNumber: `ORD-${Date.now()}`,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      amount: '',
      status: 'pending',
      paymentMethod: 'PhonePe',
      paymentStatus: 'pending',
      shippingAddress: '',
      items: []
    });
    setAddDialogOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setFormData({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      amount: order.amount.toString(),
      status: order.status?.current || order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress || '',
      items: order.items || []
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAdd = async () => {
    try {
      const newOrderData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      // MOCK: For now, just simulate API call since we're in mock mode
      // In production, you would make: await axios.post('/api/orders', newOrderData);
      
      const newOrder = {
        id: Date.now(),
        ...newOrderData,
        date: new Date().toISOString(),
        items: Array.isArray(formData.items) ? formData.items.length : 0
      };
      
      setOrders(prev => [...prev, newOrder]);
      setAddDialogOpen(false);
      setError('');
      console.log('✅ Order added (mock mode):', newOrder);
    } catch (err) {
      setError('Failed to add order');
      console.error('Error adding order:', err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      // Make API call to update order on server
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const response = await axios.put(`/api/orders/${selectedOrder.id}`, updateData);

      if (response.data.success) {
        // Update local state with server response
        setOrders(prev => prev.map(order => 
          order.id === selectedOrder.id 
            ? { 
                ...order, 
                ...updateData,
                items: Array.isArray(formData.items) ? formData.items.length : formData.items
              }
            : order
        ));
        setEditDialogOpen(false);
        setError('');
        console.log('✅ Order updated successfully:', response.data.order);
      } else {
        setError(response.data.message || 'Failed to update order');
      }
    } catch (err) {
      setError('Failed to update order. Please try again.');
      console.error('Error updating order:', err);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      // MOCK: For now, just simulate API call since we're in mock mode
      // In production, you would make: await axios.delete(`/api/orders/${selectedOrder.id}`);
      
      setOrders(prev => prev.filter(order => order.id !== selectedOrder.id));
      setDeleteDialogOpen(false);
      setError('');
      console.log('✅ Order deleted (mock mode):', selectedOrder.id);
    } catch (err) {
      setError('Failed to delete order');
      console.error('Error deleting order:', err);
    }
  };

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access the admin panel.
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

  if (!isAdmin()) {
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
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Order
          </Button>
        </Box>
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
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
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
                  <MenuItem value="recent">Last 7 Days</MenuItem>
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

      {/* Orders Table */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Orders ({filteredOrders.length})
            </Typography>
          </Box>

          {filteredOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders found
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₹{order.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.items} item{order.items !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(order.status?.current || order.status)}
                          color={getStatusColor(order.status?.current || order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {order.paymentMethod}
                          </Typography>
                          <br />
                          <Chip
                            label={order.paymentStatus}
                            color={getPaymentStatusColor(order.paymentStatus)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(order)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(order)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Order Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order Number"
                value={formData.orderNumber}
                onChange={(e) => handleFormChange('orderNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => handleFormChange('customerPhone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Order Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                >
                  <MenuItem value="PhonePe">PhonePe</MenuItem>
                  <MenuItem value="COD">Cash on Delivery</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={formData.paymentStatus}
                  label="Payment Status"
                  onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address"
                value={formData.shippingAddress}
                onChange={(e) => handleFormChange('shippingAddress', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdd} variant="contained">Add Order</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order Number"
                value={formData.orderNumber}
                onChange={(e) => handleFormChange('orderNumber', e.target.value)}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => handleFormChange('customerPhone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Order Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                >
                  <MenuItem value="PhonePe">PhonePe</MenuItem>
                  <MenuItem value="COD">Cash on Delivery</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={formData.paymentStatus}
                  label="Payment Status"
                  onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address"
                value={formData.shippingAddress}
                onChange={(e) => handleFormChange('shippingAddress', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Update Order</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the order "{selectedOrder?.orderNumber}"?
            This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Deleting this order will permanently remove it from the system.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
