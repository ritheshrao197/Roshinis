import React from 'react';
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
  Divider,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// --- Static Data for Featured Products ---
const featuredProducts = [
  {
    name: "Roshini’s NutriMix",
    description: "A nutrient-dense blend of 30+ grains, pulses, nuts, and seeds. Perfect for daily energy, protein, and immunity. 👉 Diabetic-friendly, sugar-free, and safe for all ages.",
    image: "/assets/placeholder.svg", // Place your image in public/assets/
    cta: "Add to Cart",
  },
  {
    name: "Ragi Chocobite",
    description: "A guilt-free delight that combines the power of ragi with real cocoa. Loved by kids and adults alike.",
    image: "/assets/placeholder.svg",
    cta: "Add to Cart",
  },
  {
    name: "Pure Cow Ghee",
    description: "Traditionally prepared, rich in aroma and flavor. Perfect for cooking, rituals, or just a spoonful of pure health.",
    image: "/assets/placeholder.svg",
    cta: "Add to Cart",
  },
  {
    name: "Special Kashaya Powder",
    description: "An Ayurvedic immunity booster with herbs and spices for digestion, detox, and protection against seasonal illnesses.",
    image: "/assets/placeholder.svg",
    cta: "Add to Cart",
  },
  {
    name: "Ubtan Face Pack/Wash",
    description: "Herbal skincare made with natural ingredients for glowing, healthy skin.",
    image: "/assets/placeholder.svg",
    cta: "Add to Cart",
  },
];

// --- Static Data for Testimonials ---
const testimonials = [
  {
    quote: "NutriMix has become a part of our daily breakfast. It’s healthy, filling, and my kids love it!",
    name: "Anitha R.",
  },
  {
    quote: "Finally found ghee that tastes just like my grandmother’s recipe.",
    name: "Suresh K.",
  },
  {
    quote: "The Kashaya powder is a game changer. Keeps me fresh and energetic all day.",
    name: "Lakshmi N.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  // --- Hero Section ---
  const renderHeroSection = () => (
    <Box
      sx={{
        background: 'linear-gradient(120deg, #F5F0E6 70%, #4CAF50 100%)',
        color: '#333',
        py: { xs: 8, md: 12 },
        mb: 6,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
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
                fontFamily: '"Playfair Display", serif',
                color: '#4CAF50',
              }}
            >
              Wholesome Goodness, Crafted with Care
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
            >
              Discover natural, homemade, and clean-label products that bring health and tradition to your everyday life. No preservatives. No shortcuts. Just purity in every spoon.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={() => navigate('/products')}
              >
                Explore Products
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Replace with your own image */}
            <Box
              component="img"
              src="/assets/placeholder.svg"
              alt="Family enjoying healthy breakfast"
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: 3,
                objectFit: 'cover',
                minHeight: 280,
                maxHeight: 400,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // --- Why Choose Roshini’s ---
  const renderWhyChoose = () => (
    <Box sx={{ background: '#F5F0E6', py: 6, borderRadius: 3, mb: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" color="primary" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          Why Choose Roshini’s?
        </Typography>
        <Typography align="center" sx={{ mb: 4, fontSize: 20, fontWeight: 500 }}>
          Natural. Honest. Healthy.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography fontSize={40}>🌱</Typography>
              <Typography variant="h6" gutterBottom>100% Natural & Homemade</Typography>
              <Typography variant="body2">Crafted using traditional methods with modern hygiene</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography fontSize={40}>🏡</Typography>
              <Typography variant="h6" gutterBottom>Family-Friendly</Typography>
              <Typography variant="body2">Safe, wholesome nutrition for kids, adults, and elders</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography fontSize={40}>💚</Typography>
              <Typography variant="h6" gutterBottom>Health-First</Typography>
              <Typography variant="body2">Packed with nutrients to support immunity, energy, and wellness</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography fontSize={40}>🌏</Typography>
              <Typography variant="h6" gutterBottom>Clean-Label Promise</Typography>
              <Typography variant="body2">No preservatives, no artificial flavors, no hidden ingredients</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // --- Featured Products ---
  const renderFeaturedProducts = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
        Our Bestsellers
      </Typography>
      <Typography align="center" sx={{ mb: 4 }}>
        Bring home the goodness of nature with our most-loved products:
      </Typography>
      <Grid container spacing={4}>
        {featuredProducts.map((product, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="180"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover', background: '#F5F0E6' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  {product.cta}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/products')}>
          Shop All Products
        </Button>
      </Box>
    </Box>
  );

  // --- Customer Love ---
  const renderCustomerLove = () => (
    <Box sx={{ background: '#F5F0E6', py: 6, borderRadius: 3, mb: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" color="primary" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          What Our Customers Say
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((t, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 180 }}>
                <Typography fontSize={32} color="#FFD54F" align="center" sx={{ mb: 1 }}>⭐️⭐️⭐️⭐️⭐️</Typography>
                <Typography variant="body1" align="center" sx={{ fontStyle: 'italic', mb: 2 }}>
                  “{t.quote}”
                </Typography>
                <Typography variant="subtitle2" align="center" color="primary">
                  – {t.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  // --- Blog/Knowledge Section ---
  const renderBlogPreview = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
        Eat Better. Live Better.
      </Typography>
      <Typography align="center" sx={{ mb: 4 }}>
        We’re not just about selling products—we’re here to help you make healthier choices every day. Explore our blog for wellness tips, healthy recipes, and the truth about packaged foods.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/blog')}>
          Read Our Blog
        </Button>
      </Box>
    </Box>
  );

  // --- Final Call-to-Action ---
  const renderFinalCTA = () => (
    <Box sx={{ background: '#4CAF50', color: '#fff', py: 6, borderRadius: 3, mb: 6 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          Bring Roshini’s Home Today!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Healthy living starts with the right choices. Choose natural, homemade, and honest products for your family.
        </Typography>
        <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/products')}>
          Start Shopping
        </Button>
      </Container>
    </Box>
  );

  // --- Footer Quick Info (can be moved to Footer.js) ---
  const renderFooterQuickInfo = () => (
    <Box sx={{ background: '#388E3C', color: '#fff', py: 3, borderRadius: 3, mt: 6 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          📦 Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; 🔄 Easy Returns & Refunds &nbsp;|&nbsp; 📞 Customer Support: +91 XXXXX XXXXX
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#FFD54F' }}>
          🌐 Follow Us: Instagram | Facebook | YouTube
        </Typography>
      </Container>
    </Box>
  );

  // --- Render All Sections ---
  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      {renderHeroSection()}
      {renderWhyChoose()}
      {renderFeaturedProducts()}
      {renderCustomerLove()}
      {renderBlogPreview()}
      {renderFinalCTA()}
      {renderFooterQuickInfo()}
    </Container>
  );
};

export default Home;
