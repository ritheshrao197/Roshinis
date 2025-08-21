import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login logic for testing
      let mockUser, mockToken;
      
      if (email === 'admin@example.com' && password === 'admin123') {
        // Admin user
        mockUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          phone: '+91 98765 43210',
          emailVerified: true,
          phoneVerified: true
        };
        mockToken = 'mock-admin-token-' + Date.now();
        toast.success('Welcome back, Admin!');
      } else if (email === 'user@example.com' && password === 'user123') {
        // Regular user
        mockUser = {
          id: 2,
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
          phone: '+91 98765 43211',
          emailVerified: true,
          phoneVerified: false
        };
        mockToken = 'mock-user-token-' + Date.now();
        toast.success('Login successful!');
      } else if (email === 'demo@example.com' && password === 'demo123') {
        // Demo user
        mockUser = {
          id: 3,
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'user',
          phone: '+91 98765 43212',
          emailVerified: false,
          phoneVerified: false
        };
        mockToken = 'mock-demo-token-' + Date.now();
        toast.success('Login successful!');
      } else {
        // Invalid credentials
        toast.error('Invalid email or password');
        return { success: false, message: 'Invalid credentials' };
      }
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      await axios.put(`/api/auth/reset-password/${resetToken}`, {
        password: newPassword
      });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    isAdmin,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
