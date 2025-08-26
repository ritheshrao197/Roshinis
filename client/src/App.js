import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminBanners from './pages/admin/Banners';
import AdminCoupons from './pages/admin/Coupons';
import AdminSettings from './pages/admin/Settings';
import AddProduct from './pages/admin/AddProduct';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Warm Green
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F5F0E6', // Earthy Beige
      contrastText: '#333333',
    },
    accent: {
      main: '#FFD54F', // Golden Yellow
      contrastText: '#333333',
    },
    background: {
      default: '#FFFFFF', // White backgrounds
      paper: '#F5F0E6',   // Soft beige for cards/sections
    },
    text: {
      primary: '#333333', // Charcoal Gray
      secondary: '#4CAF50',
    },
  },
  typography: {
    fontFamily: [
      '"Lato"',
      '"Poppins"',
      '"Open Sans"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", "Cormorant", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#4CAF50',
    },
    h2: {
      fontFamily: '"Playfair Display", "Cormorant", serif',
      fontWeight: 600,
      fontSize: '2rem',
      color: '#4CAF50',
    },
    h3: {
      fontFamily: '"Playfair Display", "Cormorant", serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#4CAF50',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#333333',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#333333',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#333333',
    },
    button: {
      fontWeight: 700,
      letterSpacing: 1,
    },
  },
  shape: {
    borderRadius: 16, // Softer, rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: '#4CAF50',
          color: '#fff',
          '&:hover': { backgroundColor: '#388E3C' },
        },
        containedSecondary: {
          backgroundColor: '#FFD54F',
          color: '#333333',
          '&:hover': { backgroundColor: '#FFC107' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(76,175,80,0.08)',
          background: '#fff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/banners" element={<AdminBanners />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/products/new" element={<AddProduct />} />

                  {/* 404 Route */}
                  <Route path="*" element={<div>Page not found</div>} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
