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
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminBanners = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    buttonText: '',
    position: 'hero',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBanners();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      // Mock banners data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBanners = [
        {
          id: 1,
          title: 'Summer Sale 2024',
          description: 'Get up to 50% off on selected items',
          imageUrl: '/images/banner1.jpg',
          linkUrl: '/products?sale=summer',
          buttonText: 'Shop Now',
          position: 'hero',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'New Collection Launch',
          description: 'Discover our latest collection of premium products',
          imageUrl: '/images/banner2.jpg',
          linkUrl: '/products?category=new',
          buttonText: 'Explore',
          position: 'hero',
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          title: 'Free Shipping',
          description: 'Free shipping on orders above ₹1000',
          imageUrl: '/images/banner3.jpg',
          linkUrl: '/shipping-info',
          buttonText: 'Learn More',
          position: 'sidebar',
          isActive: false,
          sortOrder: 1,
          createdAt: '2024-01-13'
        }
      ];
      
      setBanners(mockBanners);
      setError('');
    } catch (err) {
      setError('Failed to fetch banners. Please try again.');
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && banner.isActive) ||
                         (statusFilter === 'inactive' && !banner.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      buttonText: '',
      position: 'hero',
      isActive: true,
      sortOrder: 0
    });
    setAddDialogOpen(true);
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      position: banner.position,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (banner) => {
    setSelectedBanner(banner);
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
      const newBanner = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setBanners(prev => [...prev, newBanner]);
      setAddDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to add banner');
      console.error('Error adding banner:', err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      setBanners(prev => prev.map(banner => 
        banner.id === selectedBanner.id 
          ? { ...banner, ...formData }
          : banner
      ));
      setEditDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to update banner');
      console.error('Error updating banner:', err);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      setBanners(prev => prev.filter(banner => banner.id !== selectedBanner.id));
      setDeleteDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to delete banner');
      console.error('Error deleting banner:', err);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'hero':
        return 'primary';
      case 'sidebar':
        return 'info';
      case 'footer':
        return 'warning';
      default:
        return 'default';
    }
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
    return <LoadingSpinner message="Loading banners..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Banners
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchBanners}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Banner
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Search banners..."
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
          </Grid>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sort Order</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageIcon color="action" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {banner.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {banner.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={banner.position}
                      color={getPositionColor(banner.position)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={banner.isActive ? 'Active' : 'Inactive'}
                      color={getStatusColor(banner.isActive)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{banner.sortOrder}</TableCell>
                  <TableCell>{banner.createdAt}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(banner)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(banner)}
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

      {/* Add Banner Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Banner</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link URL"
                value={formData.linkUrl}
                onChange={(e) => handleFormChange('linkUrl', e.target.value)}
                placeholder="/products or https://example.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Button Text"
                value={formData.buttonText}
                onChange={(e) => handleFormChange('buttonText', e.target.value)}
                placeholder="Shop Now, Learn More, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={formData.position}
                  label="Position"
                  onChange={(e) => handleFormChange('position', e.target.value)}
                >
                  <MenuItem value="hero">Hero Section</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="footer">Footer</MenuItem>
                  <MenuItem value="popup">Popup</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value) || 0)}
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
                label="Active Banner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdd} variant="contained">Add Banner</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link URL"
                value={formData.linkUrl}
                onChange={(e) => handleFormChange('linkUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Button Text"
                value={formData.buttonText}
                onChange={(e) => handleFormChange('buttonText', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={formData.position}
                  label="Position"
                  onChange={(e) => handleFormChange('position', e.target.value)}
                >
                  <MenuItem value="hero">Hero Section</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="footer">Footer</MenuItem>
                  <MenuItem value="popup">Popup</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value) || 0)}
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
                label="Active Banner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Update Banner</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Banner Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Banner</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the banner "{selectedBanner?.title}"?
            This action cannot be undone.
          </Typography>
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

export default AdminBanners;