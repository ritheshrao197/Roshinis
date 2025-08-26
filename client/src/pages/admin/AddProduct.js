import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  OutlinedInput,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  'electronics',
  'clothing', 
  'books',
  'home',
  'sports',
  'beauty',
  'automotive',
  'other'
];
const subcategories = {
  'electronics': ['Smartphones', 'Laptops', 'Accessories'],
  'clothing': ['Men', 'Women', 'Kids'],
  'books': ['Fiction', 'Non-Fiction', 'Educational'],
  'home': ['Kitchen', 'Decor', 'Furniture'],
  'sports': ['Fitness', 'Outdoor', 'Equipment'],
  'beauty': ['Skincare', 'Makeup', 'Haircare'],
  'automotive': ['Parts', 'Accessories', 'Tools'],
  'other': ['Miscellaneous']
};
const stockStatuses = ['In Stock', 'Out of Stock', 'Pre-order'];
const units = ['g', 'kg', 'ml', 'L', 'pcs'];
const shippingClasses = ['Standard', 'Fragile', 'Heavy'];
const suitableForOptions = ['Kids', 'Adults', 'Elders', 'Diabetics', 'Everyone'];
const certifications = ['Sugar-free', 'Organic', 'Clean-label', 'Homemade'];

export default function AddProduct() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  // Form state
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Roshini’s');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockStatus, setStockStatus] = useState(stockStatuses[0]);
  const [unit, setUnit] = useState(units[0]);
  const [minOrderQty, setMinOrderQty] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suitableFor, setSuitableFor] = useState([]);
  const [shelfLife, setShelfLife] = useState('');
  const [storage, setStorage] = useState('');
  const [claims, setClaims] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [shippingClass, setShippingClass] = useState(shippingClasses[0]);
  const [variants, setVariants] = useState('');
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handlers for multi-selects
  const handleMultiChange = (setter) => (event) => {
    const { value } = event.target;
    setter(typeof value === 'string' ? value.split(',') : value);
  };

  // Handler for file uploads
  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  // Auto-generate slug from product name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setProductName(name);
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Prepare product data in the format expected by the server
      const productData = {
        name: productName,
        slug: slug,
        description: fullDesc,
        shortDescription: shortDesc,
        category: category.toLowerCase(), // Server expects lowercase categories
        subCategory: subCategory,
        sku: sku,
        brand: brand,
        price: parseFloat(sellingPrice),
        comparePrice: mrp ? parseFloat(mrp) : undefined,
        inventory: {
          quantity: parseInt(stockQty) || 0,
          trackQuantity: true,
          allowBackorder: stockStatus === 'Pre-order'
        },
        unit: unit,
        minOrderQty: parseInt(minOrderQty) || 1,
        ingredients: ingredients,
        suitableFor: suitableFor,
        shelfLife: shelfLife,
        storage: storage,
        claims: claims,
        seo: {
          metaTitle: metaTitle,
          metaDescription: metaDesc,
          keywords: keywords
        },
        shipping: {
          weight: parseFloat(weight) || 0,
          dimensions: dimensions,
          shippingClass: shippingClass
        },
        variants: variants,
        status: 'active',
        featured: false
      };

      // Send to backend using axios (which includes auth headers automatically)
      const response = await axios.post('/api/products', productData);

      if (response.data.success) {
        setMessage('Product published successfully!');
        // Reset form
        setProductName('');
        setSlug('');
        setCategory('');
        setSubCategory('');
        setSku('');
        setShortDesc('');
        setFullDesc('');
        setSellingPrice('');
        setMrp('');
        setStockQty('');
        setIngredients([]);
        setSuitableFor([]);
        setShelfLife('');
        setStorage('');
        setClaims([]);
        setMetaTitle('');
        setMetaDesc('');
        setKeywords([]);
        setWeight('');
        setDimensions('');
        setVariants('');
        setImages([]);
        setVideo('');
        
        // Redirect to products list after a delay
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        setMessage('Error: ' + (response.data.message || 'Failed to publish product'));
      }
    } catch (err) {
      console.error('Product creation error:', err);
      if (err.response?.status === 401) {
        setMessage('Error: Unauthorized. Please login as admin.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setMessage('Error: Access denied. Admin privileges required.');
      } else if (err.response?.data?.message) {
        setMessage('Error: ' + err.response.data.message);
      } else {
        setMessage('Error: Failed to publish product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          Add New Product
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Show message */}
        {message && (
          <Box sx={{ mb: 2 }}>
            <Typography color={message.startsWith('Error') ? 'error' : 'success.main'}>
              {message}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField label="Product Name" fullWidth required value={productName} onChange={handleNameChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Slug/URL" fullWidth value={slug} onChange={e => setSlug(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={e => { setCategory(e.target.value); setSubCategory(''); }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-category</InputLabel>
                <Select
                  value={subCategory}
                  label="Sub-category"
                  onChange={e => setSubCategory(e.target.value)}
                  disabled={!category}
                >
                  {(subcategories[category] || []).map(sub => <MenuItem key={sub} value={sub}>{sub}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="SKU / Product Code" fullWidth value={sku} onChange={e => setSku(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Brand" fullWidth value={brand} onChange={e => setBrand(e.target.value)} />
            </Grid>
          </Grid>

          {/* Product Description */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Product Description</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Short Description"
                fullWidth
                multiline
                inputProps={{ maxLength: 200 }}
                helperText="For product cards & previews (max 200 chars)"
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Description"
                fullWidth
                multiline
                minRows={5}
                helperText="Detailed story, benefits, ingredients, usage instructions"
                value={fullDesc}
                onChange={e => setFullDesc(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Pricing & Inventory */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Pricing & Inventory</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField label="Selling Price (₹)" type="number" fullWidth required value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="MRP (₹)" type="number" fullWidth value={mrp} onChange={e => setMrp(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Stock Quantity" type="number" fullWidth value={stockQty} onChange={e => setStockQty(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stock Status</InputLabel>
                <Select label="Stock Status" value={stockStatus} onChange={e => setStockStatus(e.target.value)}>
                  {stockStatuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Unit/Weight</InputLabel>
                <Select label="Unit/Weight" value={unit} onChange={e => setUnit(e.target.value)}>
                  {units.map(unit => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Minimum Order Quantity" type="number" fullWidth value={minOrderQty} onChange={e => setMinOrderQty(e.target.value)} />
            </Grid>
          </Grid>

          {/* Media & Assets */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Media & Assets</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Product Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              <Box sx={{ mt: 1 }}>
                {images.length > 0 && Array.from(images).map((img, idx) => (
                  <Chip key={idx} label={img.name} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Product Video (URL or upload)"
                fullWidth
                value={video}
                onChange={e => setVideo(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Product Attributes */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Product Attributes</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ingredients (comma separated)"
                fullWidth
                value={ingredients.join(', ')}
                onChange={e => setIngredients(e.target.value.split(',').map(i => i.trim()))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Suitable For</InputLabel>
                <Select
                  multiple
                  value={suitableFor}
                  onChange={handleMultiChange(setSuitableFor)}
                  input={<OutlinedInput label="Suitable For" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {suitableForOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>
                      <Checkbox checked={suitableFor.indexOf(opt) > -1} />
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Shelf Life" fullWidth value={shelfLife} onChange={e => setShelfLife(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Storage Instructions" fullWidth value={storage} onChange={e => setStorage(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Certifications/Claims</InputLabel>
                <Select
                  multiple
                  value={claims}
                  onChange={handleMultiChange(setClaims)}
                  input={<OutlinedInput label="Certifications/Claims" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {certifications.map(opt => (
                    <MenuItem key={opt} value={opt}>
                      <Checkbox checked={claims.indexOf(opt) > -1} />
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* SEO Settings */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>SEO Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Meta Title" fullWidth value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Meta Description" fullWidth value={metaDesc} onChange={e => setMetaDesc(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Keywords (comma separated)"
                fullWidth
                value={keywords.join(', ')}
                onChange={e => setKeywords(e.target.value.split(',').map(i => i.trim()))}
              />
            </Grid>
          </Grid>

          {/* Shipping & Variants */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Shipping & Variants</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField label="Weight" type="number" fullWidth value={weight} onChange={e => setWeight(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Dimensions (L × W × H)" fullWidth value={dimensions} onChange={e => setDimensions(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Shipping Class</InputLabel>
                <Select label="Shipping Class" value={shippingClass} onChange={e => setShippingClass(e.target.value)}>
                  {shippingClasses.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Variants (e.g., size, flavor)" fullWidth value={variants} onChange={e => setVariants(e.target.value)} />
            </Grid>
          </Grid>

          {/* Page Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 5, justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="secondary" type="button">Save as Draft</Button>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Product'}
            </Button>
            <Button variant="text" color="error" type="button">Cancel</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
