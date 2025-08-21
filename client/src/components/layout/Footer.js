import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.grey[300],
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="white" gutterBottom>
              E-Commerce Platform
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted online shopping destination with secure payments via PhonePe 
              and reliable shipping through Delhivery. Discover quality products at 
              competitive prices.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#1877f2'
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Twitter"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#1da1f2'
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#e4405f'
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="LinkedIn"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#0077b5'
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="white" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Home
              </Link>
              <Link
                href="/products"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Products
              </Link>
              <Link
                href="/about"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="white" gutterBottom>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/help"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Help Center
              </Link>
              <Link
                href="/shipping"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Returns
              </Link>
              <Link
                href="/faq"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Payment & Shipping */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="white" gutterBottom>
              Payment & Shipping
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/payment-methods"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Payment Methods
              </Link>
              <Link
                href="/shipping-policy"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Shipping Policy
              </Link>
              <Link
                href="/track-order"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Track Order
              </Link>
              <Link
                href="/delivery-areas"
                color="inherit"
                underline="hover"
                sx={{ '&:hover': { color: 'white' } }}
              >
                Delivery Areas
              </Link>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="white" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  support@ecommerce.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">
                  Mumbai, Maharashtra, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="grey[400]">
            © {currentYear} E-Commerce Platform. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/privacy"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ '&:hover': { color: 'white' } }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ '&:hover': { color: 'white' } }}
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ '&:hover': { color: 'white' } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>

        {/* Trust Badges */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            mt: 3,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography variant="body2" color="grey[400]">
            Secure Payments via
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              px: 2,
              py: 1,
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="white" fontWeight="bold">
              PhonePe
            </Typography>
          </Box>
          
          <Typography variant="body2" color="grey[400]">
            Shipping by
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              px: 2,
              py: 1,
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="white" fontWeight="bold">
              Delhivery
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
