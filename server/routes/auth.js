const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// const User = require('../models/User'); // Commented out for mock mode
const { protect, authorize, sendTokenResponse } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// @desc    Register user - MOCK VERSION
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone } = req.body;

    // MOCK: Simulate user registration
    const mockUser = {
      _id: 'mock-user-' + Date.now(),
      name,
      email,
      phone,
      role: 'user',
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date()
    };

    const mockToken = 'mock-user-token-' + Date.now();

    console.log('✅ Mock user registered:', mockUser.email);

    res.status(201).json({
      success: true,
      token: mockToken,
      user: mockUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Login user - MOCK VERSION
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // MOCK: Simple credential check
    let mockUser, mockToken;
    
    if (email === 'admin@example.com' && password === 'admin123') {
      mockUser = {
        _id: 'mock-admin-id',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        phone: '+91 98765 43210',
        isActive: true,
        emailVerified: true,
        phoneVerified: true
      };
      mockToken = 'mock-admin-token-' + Date.now();
    } else if (email === 'user@example.com' && password === 'user123') {
      mockUser = {
        _id: 'mock-user-id',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        phone: '+91 98765 43211',
        isActive: true,
        emailVerified: true,
        phoneVerified: false
      };
      mockToken = 'mock-user-token-' + Date.now();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ Mock user logged in:', mockUser.email);

    res.json({
      success: true,
      token: mockToken,
      user: mockUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get current user profile - MOCK VERSION
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    // MOCK: Return the user data from the auth middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Update user profile - MOCK VERSION
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, phone, addresses } = req.body;
    
    // MOCK: Update user data from middleware
    const updatedUser = {
      ...req.user,
      ...(name && { name }),
      ...(phone && { phone }),
      ...(addresses && { addresses }),
      updatedAt: new Date()
    };

    console.log('✅ Mock user profile updated:', updatedUser.email);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Change password - MOCK VERSION
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // MOCK: Simple password change simulation
    console.log('✅ Mock password changed for user:', req.user.email);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Forgot password - MOCK VERSION
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // MOCK: Check if email exists in our mock system
    if (email !== 'admin@example.com' && email !== 'user@example.com') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // MOCK: Generate a mock reset token
    const resetToken = 'mock-reset-token-' + Date.now();

    console.log('✅ Mock password reset token generated for:', email);

    res.json({
      success: true,
      message: 'Password reset token sent to email',
      resetToken: resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Reset password - MOCK VERSION
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
router.put('/reset-password/:resetToken', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { resetToken } = req.params;
    const { password } = req.body;

    // MOCK: Check if reset token is valid (our mock tokens)
    if (!resetToken.startsWith('mock-reset-token')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    console.log('✅ Mock password reset successful for token:', resetToken);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get all users (admin only) - MOCK VERSION
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    // MOCK: Return mock users data
    const mockUsers = [
      {
        _id: 'mock-admin-id',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        phone: '+91 98765 43210',
        isActive: true,
        emailVerified: true,
        createdAt: '2024-01-15'
      },
      {
        _id: 'mock-user-id',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        phone: '+91 98765 43211',
        isActive: true,
        emailVerified: true,
        createdAt: '2024-01-14'
      }
    ];

    console.log('✅ Mock users fetched:', mockUsers.length);

    res.json({
      success: true,
      count: mockUsers.length,
      users: mockUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
