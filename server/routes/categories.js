const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Mock categories data
let mockCategories = [
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

// @desc    Get all categories (public)
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, parent } = req.query;
    
    let filteredCategories = [...mockCategories];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredCategories = filteredCategories.filter(cat => cat.status === status);
    }
    
    // Filter by parent category
    if (parent === 'root') {
      filteredCategories = filteredCategories.filter(cat => !cat.parentCategory);
    } else if (parent && parent !== 'all') {
      filteredCategories = filteredCategories.filter(cat => cat.parentCategory === parseInt(parent));
    }
    
    console.log(`✅ Categories fetched: ${filteredCategories.length} categories`);
    
    res.json({
      success: true,
      count: filteredCategories.length,
      categories: filteredCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = mockCategories.find(cat => cat.id === parseInt(req.params.id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Create new category (admin only)
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Slug must be between 2 and 100 characters')
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

    const { name, description, slug, status, parentCategory, sortOrder } = req.body;
    
    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug already exists
    const existingCategory = mockCategories.find(cat => cat.slug === finalSlug);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }
    
    const newCategory = {
      id: Math.max(...mockCategories.map(cat => cat.id)) + 1,
      name,
      description: description || '',
      slug: finalSlug,
      status: status || 'active',
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    mockCategories.push(newCategory);
    
    console.log('✅ Category created:', newCategory.name);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Update category (admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
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

    const categoryIndex = mockCategories.findIndex(cat => cat.id === parseInt(req.params.id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Update category
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...req.body,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    console.log('✅ Category updated:', mockCategories[categoryIndex].name);
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category: mockCategories[categoryIndex]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Delete category (admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const categoryIndex = mockCategories.findIndex(cat => cat.id === parseInt(req.params.id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const category = mockCategories[categoryIndex];
    
    // Check if category has products
    if (category.productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }
    
    // Check if category has subcategories
    const hasSubcategories = mockCategories.some(cat => cat.parentCategory === category.id);
    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }
    
    mockCategories.splice(categoryIndex, 1);
    
    console.log('✅ Category deleted:', category.name);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get category hierarchy
// @route   GET /api/categories/hierarchy
// @access  Public
router.get('/hierarchy', async (req, res) => {
  try {
    // Build category tree
    const rootCategories = mockCategories.filter(cat => !cat.parentCategory);
    const categoryTree = rootCategories.map(root => ({
      ...root,
      children: mockCategories.filter(cat => cat.parentCategory === root.id)
    }));
    
    res.json({
      success: true,
      hierarchy: categoryTree
    });
  } catch (error) {
    console.error('Get category hierarchy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;