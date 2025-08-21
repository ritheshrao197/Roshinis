import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Paper,
  Badge,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // In real app, make API call here
      // const response = await api.getProduct(id);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProduct = {
        id: parseInt(id),
        name: `Premium Product ${id}`,
        description: `This is a high-quality product with excellent features. It's designed to provide the best user experience with premium materials and craftsmanship. Perfect for daily use and long-term durability.`,
        longDescription: `This premium product represents the pinnacle of quality and innovation. Crafted with attention to detail, it combines cutting-edge technology with timeless design principles. The product features advanced functionality while maintaining ease of use, making it accessible to users of all skill levels.

        Key Features:
        • Premium build quality with durable materials
        • Advanced technology for optimal performance
        • User-friendly interface and controls
        • Comprehensive warranty and support
        • Environmentally conscious manufacturing
        • Multiple color and size options available
        
        Whether you're a professional or casual user, this product will exceed your expectations and provide years of reliable service.`,
        price: Math.floor(Math.random() * 5000) + 1000,
        originalPrice: Math.floor(Math.random() * 6000) + 1200,
        category: 'Electronics',
        images: [
          `https://picsum.photos/600/600?random=${id}`,
          `https://picsum.photos/600/600?random=${id + 100}`,
          `https://picsum.photos/600/600?random=${id + 200}`,
          `https://picsum.photos/600/600?random=${id + 300}`
        ],
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 200) + 50,
        inStock: Math.random() > 0.2,
        stockQuantity: Math.floor(Math.random() * 100) + 10,
        onSale: Math.random() > 0.6,
        discount: Math.floor(Math.random() * 30) + 10,
        sku: `SKU-${id.toString().padStart(6, '0')}`,
        weight: '0.5 kg',
        dimensions: '15 x 10 x 5 cm',
        brand: 'Premium Brand',
        warranty: '2 Years',
        returnPolicy: '30 Days',
        shipping: 'Free shipping on orders above ₹999',
        estimatedDelivery: '3-5 business days'
      };

      setProduct(mockProduct);
      setSelectedImage(0);
      
      // Fetch reviews and related products
      fetchReviews(mockProduct.id);
      fetchRelatedProducts(mockProduct.category);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch product details. Please try again.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    // Mock reviews
    const mockReviews = [
      {
        id: 1,
        user: 'John Doe',
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellent product! Quality is outstanding and delivery was fast. Highly recommended!'
      },
      {
        id: 2,
        user: 'Sarah Smith',
        rating: 4,
        date: '2024-01-10',
        comment: 'Great product, very satisfied with the purchase. The only minor issue is the packaging could be better.'
      },
      {
        id: 3,
        user: 'Mike Johnson',
        rating: 5,
        date: '2024-01-05',
        comment: 'Amazing quality and value for money. Exceeded my expectations completely!'
      }
    ];
    setReviews(mockReviews);
  };

  const fetchRelatedProducts = async (category) => {
    // Mock related products
    const mockRelated = Array.from({ length: 4 }, (_, i) => ({
      id: Math.floor(Math.random() * 1000) + 100,
      name: `Related Product ${i + 1}`,
      price: Math.floor(Math.random() * 3000) + 500,
      image: `https://picsum.photos/200/200?random=${i + 500}`,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));
    setRelatedProducts(mockRelated);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity
    });
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} color="primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" color="primary" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} color="disabled" />);
    }

    return stars;
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const cartItem = getCartItem(product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/products')}
          sx={{ cursor: 'pointer' }}
        >
          Products
        </Link>
        <Typography variant="body2" color="text.primary">
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="500"
              image={product.images[selectedImage]}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          
          {/* Thumbnail Images */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {product.images.map((image, index) => (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : 'none',
                  opacity: selectedImage === index ? 1 : 0.7,
                  '&:hover': { opacity: 1 }
                }}
                onClick={() => handleImageSelect(index)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  width="80"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            {/* Category and Brand */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={product.category} size="small" color="primary" variant="outlined" />
              <Chip label={product.brand} size="small" variant="outlined" />
            </Box>

            {/* Product Name */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                {renderRatingStars(parseFloat(product.rating))}
              </Box>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {product.rating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              {product.onSale ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    ₹{product.price.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{product.originalPrice.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`${product.discount}% OFF`}
                    color="error"
                    size="large"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              ) : (
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{product.price.toLocaleString()}
                </Typography>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {product.inStock ? (
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                  ✓ In Stock ({product.stockQuantity} available)
                </Typography>
              ) : (
                <Typography variant="body1" color="error" sx={{ fontWeight: 'bold' }}>
                  ✗ Out of Stock
                </Typography>
              )}
            </Box>

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} sm={4}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{
                      min: 1,
                      max: product.stockQuantity
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    startIcon={<CartIcon />}
                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    {cartItem ? `Update Cart (${currentQuantity + quantity})` : 'Add to Cart'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                onClick={toggleFavorite}
                fullWidth
              >
                {isFavorite ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
              >
                Share
              </Button>
            </Box>

            {/* Product Details */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {product.sku}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Brand: {product.brand}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Weight: {product.weight}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dimensions: {product.dimensions}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Trust Badges */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="body2">
                  {product.warranty} Warranty
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefreshIcon color="primary" />
                <Typography variant="body2">
                  {product.returnPolicy} Returns
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShippingIcon color="primary" />
                <Typography variant="body2">
                  {product.shipping}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label={`Reviews (${reviews.length})`} />
          <Tab label="Shipping & Returns" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {product.longDescription}
            </Typography>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Product Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="SKU" secondary={product.sku} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Brand" secondary={product.brand} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Category" secondary={product.category} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Weight" secondary={product.weight} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Dimensions" secondary={product.dimensions} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Warranty & Support</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Warranty" secondary={product.warranty} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Return Policy" secondary={product.returnPolicy} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Shipping" secondary={product.shipping} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Estimated Delivery" secondary={product.estimatedDelivery} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Box>
              {reviews.map((review) => (
                <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>{review.user[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {review.user}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderRatingStars(review.rating)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1">{review.comment}</Typography>
                </Paper>
              ))}
            </Box>
          )}

          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                  <Typography variant="body1" paragraph>
                    {product.shipping}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Estimated delivery: {product.estimatedDelivery}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We ship to all major cities and towns across India. International shipping available for select countries.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Return Policy</Typography>
                  <Typography variant="body1" paragraph>
                    {product.returnPolicy} return window for most items.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Easy returns with prepaid shipping labels. Refunds processed within 5-7 business days.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={6} sm={4} md={3} key={relatedProduct.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={relatedProduct.image}
                    alt={relatedProduct.name}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" noWrap>
                      {relatedProduct.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₹{relatedProduct.price.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={parseFloat(relatedProduct.rating)} readOnly size="small" />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {relatedProduct.rating}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
