import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Drawer,
  Checkbox,
  FormControlLabel,
  Fab,
  Badge,
  CardActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    inStock: false,
    onSale: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock categories - in real app, fetch from API
  useEffect(() => {
    setCategories([
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Books',
      'Sports',
      'Beauty',
      'Toys',
      'Automotive'
    ]);
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Make API call to get products
      const params = {
        page: currentPage,
        limit: 12 // Show 12 products per page
      };
      
      // Only add parameters if they have values
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (selectedCategory && selectedCategory !== '') {
        params.category = selectedCategory;
      }
      if (sortBy && sortBy !== '') {
        params.sort = sortBy;
      }
      
      const response = await axios.get('/api/products', { params });

      if (response.data.success) {
        // Transform API data to match the UI format
        const transformedProducts = response.data.products.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description || `This is a sample product description for ${product.name}. It includes various features and benefits.`,
          price: product.price,
          originalPrice: product.comparePrice || (product.price * 1.2), // 20% markup for original price
          category: product.category,
          image: `https://picsum.photos/300/300?random=${product._id?.slice(-3) || Math.floor(Math.random() * 1000)}`,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          inStock: product.status === 'active',
          onSale: Math.random() > 0.7,
          discount: Math.floor(Math.random() * 30) + 10
        }));
        
        setProducts(transformedProducts);
        setTotalPages(response.data.pages || 1);
        setError(''); // Clear any previous errors
        console.log('✅ Public products loaded:', transformedProducts.length);
      } else {
        setError('Failed to fetch products from API');
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, currentPage, filters, categories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      inStock: false,
      onSale: false
    });
    setSelectedCategory('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Sale Badge */}
        {product.onSale && (
          <Chip
            label={`${product.discount}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold'
            }}
          />
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <Chip
            label="Out of Stock"
            color="default"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white'
            }}
          />
        )}

        {/* Quick Actions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            gap: 1
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
            onClick={() => handleViewProduct(product)}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {product.category}
        </Typography>
        
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            lineHeight: 1.3,
            flexGrow: 1
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {product.description}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            ⭐ {product.rating}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({product.reviewCount} reviews)
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 2 }}>
          {product.onSale ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                ₹{product.price.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ₹{product.originalPrice.toLocaleString()}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              ₹{product.price.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => handleViewProduct(product)}
            startIcon={<ViewIcon />}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={!product.inStock}
            onClick={() => handleAddToCart(product)}
            startIcon={<CartIcon />}
          >
            {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderFilters = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      {/* Categories */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Typography variant="subtitle2" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Min"
          type="number"
          size="small"
          value={filters.priceRange[0]}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
          }))}
        />
        <TextField
          label="Max"
          type="number"
          size="small"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            priceRange: [prev.priceRange[0], parseInt(e.target.value) || 10000]
          }))}
        />
      </Box>

      {/* Other Filters */}
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.inStock}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              inStock: e.target.checked
            }))}
          />
        }
        label="In Stock Only"
        sx={{ mb: 1 }}
      />
      
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.onSale}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              onSale: e.target.checked
            }))}
          />
        }
        label="On Sale Only"
        sx={{ mb: 2 }}
      />

      <Button
        variant="outlined"
        fullWidth
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </Box>
  );

  if (loading && products.length === 0) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" color="primary" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
          Explore Our Products
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Pure, natural, and crafted with care for your family’s well-being.
        </Typography>
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={toggleFilters}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {loading ? (
          Array.from({ length: 9 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: 4, boxShadow: 2, minHeight: 350 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : error ? (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        ) : products.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
              No products found.
            </Typography>
          </Grid>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 16px rgba(76,175,80,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    boxShadow: '0 8px 24px rgba(76,175,80,0.16)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover', background: '#F5F0E6', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                  />
                  {product.onSale && (
                    <Chip
                      label="On Sale"
                      color="warning"
                      size="small"
                      sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700 }}
                    />
                  )}
                  {!product.inStock && (
                    <Chip
                      label="Out of Stock"
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ fontFamily: '"Playfair Display", serif' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" color="accent.main" sx={{ fontWeight: 700 }}>
                      ₹{product.price}
                    </Typography>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" color="success.main">
                    {product.inStock ? 'In Stock' : 'Currently Unavailable'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      borderRadius: 24,
                      fontWeight: 700,
                      fontSize: 16,
                      py: 1.2,
                      boxShadow: 'none',
                    }}
                  >
                    <CartIcon sx={{ mr: 1 }} />
                    {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={showFilters}
        onClose={toggleFilters}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 320
          }
        }}
      >
        {renderFilters()}
      </Drawer>

      {/* Mobile Filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          onClick={toggleFilters}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <Badge badgeContent={0} color="error">
            <FilterIcon />
          </Badge>
        </Fab>
      )}
    </Container>
  );
};

export default Products;
