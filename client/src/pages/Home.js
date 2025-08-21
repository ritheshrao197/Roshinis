import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products/featured');
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      description: 'Latest gadgets and devices',
      color: '#1976d2'
    },
    {
      name: 'Fashion',
      icon: '👕',
      description: 'Trendy clothing and accessories',
      color: '#dc004e'
    },
    {
      name: 'Home & Living',
      icon: '🏠',
      description: 'Furniture and home decor',
      color: '#2e7d32'
    },
    {
      name: 'Books',
      icon: '📚',
      description: 'Knowledge and entertainment',
      color: '#ed6c02'
    }
  ];

  const renderHeroSection = () => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        mb: 6,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Discover Amazing Products
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
            >
              Shop the latest trends with secure payments and fast delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                Shop Now
                <ArrowIcon sx={{ ml: 1 }} />
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px'
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '8rem', opacity: 0.1 }}>
                🛍️
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const renderCategories = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Shop by Category
      </Typography>
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate(`/products?category=${category.name.toLowerCase()}`)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                  {category.icon}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderFeaturedProducts = () => (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Featured Products
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
          endIcon={<ArrowIcon />}
        >
          View All
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0]?.url || '/placeholder-image.jpg'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.shortDescription || product.description?.substring(0, 60)}...
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating?.average || 0} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating?.count || 0})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{product.price}
                    </Typography>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ₹{product.comparePrice}
                      </Typography>
                    )}
                  </Box>

                  {product.inventory?.quantity === 0 && (
                    <Chip label="Out of Stock" color="error" size="small" />
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.inventory?.quantity === 0}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewProduct(product._id)}
                    sx={{ minWidth: 'auto' }}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderFeatures = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Why Choose Us?
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                color: 'white'
              }}
            >
              <Typography variant="h3">🔒</Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Secure Payments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shop with confidence using PhonePe's secure payment gateway
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                color: 'white'
              }}
            >
              <Typography variant="h3">🚚</Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Fast Delivery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick and reliable shipping through Delhivery network
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                color: 'white'
              }}
            >
              <Typography variant="h3">💎</Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Quality Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Curated selection of high-quality products at best prices
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      {renderHeroSection()}
      {renderCategories()}
      {renderFeaturedProducts()}
      {renderFeatures()}
    </Container>
  );
};

export default Home;
