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
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocalOffer as CouponIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCoupons = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    usedCount: 0,
    validFrom: '',
    validTo: '',
    isActive: true,
    applicableCategories: [],
    applicableProducts: []
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCoupons();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      // Mock coupons data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCoupons = [
        {
          id: 1,
          code: 'WELCOME20',
          description: '20% off for new customers',
          type: 'percentage',
          value: 20,
          minOrderAmount: 500,
          maxDiscount: 200,
          usageLimit: 100,
          usedCount: 23,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          isActive: true,
          applicableCategories: ['all'],
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          code: 'FLAT100',
          description: 'Flat ₹100 off on orders above ₹1000',
          type: 'fixed',
          value: 100,
          minOrderAmount: 1000,
          maxDiscount: 100,
          usageLimit: 500,
          usedCount: 156,
          validFrom: '2024-01-01',
          validTo: '2024-06-30',
          isActive: true,
          applicableCategories: ['electronics', 'clothing'],
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          code: 'SUMMER50',
          description: 'Summer sale - 50% off',
          type: 'percentage',
          value: 50,
          minOrderAmount: 0,
          maxDiscount: 500,
          usageLimit: 50,
          usedCount: 50,
          validFrom: '2024-03-01',
          validTo: '2024-05-31',
          isActive: false,
          applicableCategories: ['clothing'],
          createdAt: '2024-01-13'
        }
      ];
      
      setCoupons(mockCoupons);
      setError('');
    } catch (err) {
      setError('Failed to fetch coupons. Please try again.');
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.isActive) ||
                         (statusFilter === 'inactive' && !coupon.isActive);
    const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAdd = () => {
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      usedCount: 0,
      validFrom: '',
      validTo: '',
      isActive: true,
      applicableCategories: [],
      applicableProducts: []
    });
    setAddDialogOpen(true);
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      usedCount: coupon.usedCount,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      isActive: coupon.isActive,
      applicableCategories: coupon.applicableCategories || [],
      applicableProducts: coupon.applicableProducts || []
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could show a toast notification here
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmitAdd = async () => {
    try {
      const newCoupon = {
        id: Date.now(),
        ...formData,
        value: parseFloat(formData.value),
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        maxDiscount: parseFloat(formData.maxDiscount) || null,
        usageLimit: parseInt(formData.usageLimit) || null,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCoupons(prev => [...prev, newCoupon]);
      setAddDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to add coupon');
      console.error('Error adding coupon:', err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      setCoupons(prev => prev.map(coupon => 
        coupon.id === selectedCoupon.id 
          ? { 
              ...coupon, 
              ...formData,
              value: parseFloat(formData.value),
              minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
              maxDiscount: parseFloat(formData.maxDiscount) || null,
              usageLimit: parseInt(formData.usageLimit) || null
            }
          : coupon
      ));
      setEditDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to update coupon');
      console.error('Error updating coupon:', err);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      setCoupons(prev => prev.filter(coupon => coupon.id !== selectedCoupon.id));
      setDeleteDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to delete coupon');
      console.error('Error deleting coupon:', err);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  const getTypeColor = (type) => {
    return type === 'percentage' ? 'primary' : 'info';
  };

  const getUsageColor = (usedCount, usageLimit) => {
    if (!usageLimit) return 'default';
    const percentage = (usedCount / usageLimit) * 100;
    if (percentage >= 100) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const isExpired = (validTo) => {
    return new Date(validTo) < new Date();
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access the admin panel.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/login')}>
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
        <Button variant="outlined" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading coupons..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Coupons
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCoupons}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Coupon
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Search coupons..."
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Valid Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CouponIcon color="action" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {coupon.code}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyCode(coupon.code)}
                        color="primary"
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {coupon.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      color={getTypeColor(coupon.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </Typography>
                    {coupon.minOrderAmount > 0 && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Min: ₹{coupon.minOrderAmount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.usageLimit ? (
                      <Box>
                        <Typography variant="body2">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </Typography>
                        <Chip
                          label={`${Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%`}
                          color={getUsageColor(coupon.usedCount, coupon.usageLimit)}
                          size="small"
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unlimited
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}
                    </Typography>
                    {isExpired(coupon.validTo) && (
                      <Chip label="Expired" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.isActive ? 'Active' : 'Inactive'}
                      color={getStatusColor(coupon.isActive)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(coupon)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(coupon)}
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
      </Card>

      {/* Add Coupon Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Coupon</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                required
                placeholder="Enter code or generate one"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={generateCouponCode}
                sx={{ height: '56px' }}
              >
                Generate Code
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Discount Type"
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                type="number"
                value={formData.value}
                onChange={(e) => handleFormChange('value', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount (₹)"
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => handleFormChange('minOrderAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Discount (₹)"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => handleFormChange('maxDiscount', e.target.value)}
                helperText="For percentage coupons"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleFormChange('usageLimit', e.target.value)}
                helperText="Leave empty for unlimited"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleFormChange('validFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid To"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleFormChange('validTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                  />
                }
                label="Active Coupon"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdd} variant="contained">Add Coupon</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Coupon</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Code"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Discount Type"
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                type="number"
                value={formData.value}
                onChange={(e) => handleFormChange('value', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount (₹)"
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => handleFormChange('minOrderAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Discount (₹)"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => handleFormChange('maxDiscount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleFormChange('usageLimit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Used Count"
                type="number"
                value={formData.usedCount}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleFormChange('validFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid To"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleFormChange('validTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                  />
                }
                label="Active Coupon"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Update Coupon</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Coupon Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the coupon "{selectedCoupon?.code}"?
            This action cannot be undone.
          </Typography>
          {selectedCoupon?.usedCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This coupon has been used {selectedCoupon.usedCount} times. 
              Deleting it may affect order history.
            </Alert>
          )}
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

export default AdminCoupons;