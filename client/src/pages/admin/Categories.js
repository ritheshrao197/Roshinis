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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCategories = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    status: 'active',
    parentCategory: '',
    sortOrder: 0
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCategories();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Mock categories data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories = [
        {
          id: 1,
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          slug: 'electronics',
          status: 'active',
          parentCategory: null,
          sortOrder: 1,
          productCount: 25,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Clothing',
          description: 'Fashion and apparel items',
          slug: 'clothing',
          status: 'active',
          parentCategory: null,
          sortOrder: 2,
          productCount: 18,
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          name: 'Books',
          description: 'Educational and entertainment books',
          slug: 'books',
          status: 'active',
          parentCategory: null,
          sortOrder: 3,
          productCount: 12,
          createdAt: '2024-01-13'
        },
        {
          id: 4,
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          slug: 'smartphones',
          status: 'active',
          parentCategory: 1,
          sortOrder: 1,
          productCount: 8,
          createdAt: '2024-01-12'
        }
      ];
      
      setCategories(mockCategories);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      status: 'active',
      parentCategory: '',
      sortOrder: 0
    });
    setAddDialogOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      status: category.status,
      parentCategory: category.parentCategory || '',
      sortOrder: category.sortOrder
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleSubmitAdd = async () => {
    try {
      // In real app, make API call here
      console.log('Adding category:', formData);
      
      const newCategory = {
        id: Date.now(),
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCategories(prev => [...prev, newCategory]);
      setAddDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to add category');
      console.error('Error adding category:', err);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      // In real app, make API call here
      console.log('Editing category:', selectedCategory.id, formData);
      
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      setEditDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      // In real app, make API call here
      console.log('Deleting category:', selectedCategory.id);
      
      setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      setDeleteDialogOpen(false);
      setError('');
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getCategoryName = (parentId) => {
    if (!parentId) return 'Root';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'Unknown';
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
    return <LoadingSpinner message="Loading categories..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCategories}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Category
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
                placeholder="Search categories..."
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

      {/* Categories Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      /{category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{getCategoryName(category.parentCategory)}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.status}
                      color={getStatusColor(category.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category)}
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

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                helperText="Auto-generated from name"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentCategory}
                  label="Parent Category"
                  onChange={(e) => handleFormChange('parentCategory', e.target.value)}
                >
                  <MenuItem value="">None (Root Category)</MenuItem>
                  {categories.filter(cat => !cat.parentCategory).map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdd} variant="contained">Add Category</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentCategory}
                  label="Parent Category"
                  onChange={(e) => handleFormChange('parentCategory', e.target.value)}
                >
                  <MenuItem value="">None (Root Category)</MenuItem>
                  {categories.filter(cat => !cat.parentCategory && cat.id !== selectedCategory?.id).map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Update Category</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedCategory?.name}"?
            This action cannot be undone.
          </Typography>
          {selectedCategory?.productCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category contains {selectedCategory.productCount} products. 
              Deleting it will affect those products.
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

export default AdminCategories;