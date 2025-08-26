import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Email as EmailIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Roshini\'s E-commerce',
    siteDescription: 'Your trusted online shopping destination',
    siteUrl: 'https://roshinishop.com',
    contactEmail: 'info@roshinishop.com',
    contactPhone: '+91 98765 43210',
    address: '123 Business Street, City, State, India',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
    maintenanceMode: false
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    phonepeEnabled: true,
    phonepeKey: 'your-phonepe-key',
    codEnabled: true,
    codCharges: 50,
    minOrderForFreeShipping: 1000,
    taxRate: 18,
    processingFee: 2.5
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 1000,
    standardShippingRate: 100,
    expressShippingRate: 200,
    internationalShipping: false,
    estimatedDeliveryDays: 7,
    returnPolicy: 30,
    exchangePolicy: 15
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@roshinishop.com',
    fromName: 'Roshini\'s Shop',
    orderConfirmationEnabled: true,
    shippingNotificationEnabled: true,
    promotionalEmailsEnabled: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    dataRetentionDays: 365
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchSettings();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - in real app, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Settings are already initialized above
      setError('');
    } catch (err) {
      setError('Failed to fetch settings. Please try again.');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Mock API call - in real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful save
      setSuccess('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralChange = (field, value) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingChange = (field, value) => {
    setShippingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field, value) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access the admin panel.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Access denied. Admin privileges required.
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSettings}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            Save All Settings
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {loading && <LoadingSpinner message="Loading settings..." />}

      {/* Settings Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          <Tab icon={<StoreIcon />} label="General" />
          <Tab icon={<PaymentIcon />} label="Payment" />
          <Tab icon={<ShippingIcon />} label="Shipping" />
          <Tab icon={<EmailIcon />} label="Email" />
          <Tab icon={<SecurityIcon />} label="Security" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>General Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={generalSettings.siteName}
                    onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site URL"
                    value={generalSettings.siteUrl}
                    onChange={(e) => handleGeneralChange('siteUrl', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Site Description"
                    value={generalSettings.siteDescription}
                    onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => handleGeneralChange('contactEmail', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => handleGeneralChange('contactPhone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Address"
                    value={generalSettings.address}
                    onChange={(e) => handleGeneralChange('address', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={generalSettings.timezone}
                      label="Timezone"
                      onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                    >
                      <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="America/New_York">America/New_York</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={generalSettings.currency}
                      label="Currency"
                      onChange={(e) => handleGeneralChange('currency', e.target.value)}
                    >
                      <MenuItem value="INR">INR (₹)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={generalSettings.language}
                      label="Language"
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.maintenanceMode}
                        onChange={(e) => handleGeneralChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode (Site will be temporarily unavailable to customers)"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Payment Settings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paymentSettings.phonepeEnabled}
                        onChange={(e) => handlePaymentChange('phonepeEnabled', e.target.checked)}
                      />
                    }
                    label="Enable PhonePe Payments"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paymentSettings.codEnabled}
                        onChange={(e) => handlePaymentChange('codEnabled', e.target.checked)}
                      />
                    }
                    label="Enable Cash on Delivery"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PhonePe API Key"
                    value={paymentSettings.phonepeKey}
                    onChange={(e) => handlePaymentChange('phonepeKey', e.target.value)}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="COD Charges (₹)"
                    type="number"
                    value={paymentSettings.codCharges}
                    onChange={(e) => handlePaymentChange('codCharges', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={(e) => handlePaymentChange('taxRate', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Processing Fee (%)"
                    type="number"
                    value={paymentSettings.processingFee}
                    onChange={(e) => handlePaymentChange('processingFee', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Shipping Settings Tab */}
        <TabPanel value={activeTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shipping Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Free Shipping Threshold (₹)"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => handleShippingChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Standard Shipping Rate (₹)"
                    type="number"
                    value={shippingSettings.standardShippingRate}
                    onChange={(e) => handleShippingChange('standardShippingRate', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Express Shipping Rate (₹)"
                    type="number"
                    value={shippingSettings.expressShippingRate}
                    onChange={(e) => handleShippingChange('expressShippingRate', parseFloat(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estimated Delivery Days"
                    type="number"
                    value={shippingSettings.estimatedDeliveryDays}
                    onChange={(e) => handleShippingChange('estimatedDeliveryDays', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Return Policy (Days)"
                    type="number"
                    value={shippingSettings.returnPolicy}
                    onChange={(e) => handleShippingChange('returnPolicy', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Exchange Policy (Days)"
                    type="number"
                    value={shippingSettings.exchangePolicy}
                    onChange={(e) => handleShippingChange('exchangePolicy', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={shippingSettings.internationalShipping}
                        onChange={(e) => handleShippingChange('internationalShipping', e.target.checked)}
                      />
                    }
                    label="Enable International Shipping"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Email Settings Tab */}
        <TabPanel value={activeTab} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Email Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Host"
                    value={emailSettings.smtpHost}
                    onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Port"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => handleEmailChange('smtpPort', parseInt(e.target.value) || 587)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Username"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Password"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="From Email"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="From Name"
                    value={emailSettings.fromName}
                    onChange={(e) => handleEmailChange('fromName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.orderConfirmationEnabled}
                        onChange={(e) => handleEmailChange('orderConfirmationEnabled', e.target.checked)}
                      />
                    }
                    label="Order Confirmation Emails"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.shippingNotificationEnabled}
                        onChange={(e) => handleEmailChange('shippingNotificationEnabled', e.target.checked)}
                      />
                    }
                    label="Shipping Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.promotionalEmailsEnabled}
                        onChange={(e) => handleEmailChange('promotionalEmailsEnabled', e.target.checked)}
                      />
                    }
                    label="Promotional Emails"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={activeTab} index={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Security Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value) || 60)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Login Attempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password Minimum Length"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => handleSecurityChange('passwordMinLength', parseInt(e.target.value) || 8)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.requireUppercase}
                        onChange={(e) => handleSecurityChange('requireUppercase', e.target.checked)}
                      />
                    }
                    label="Require Uppercase"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.requireNumbers}
                        onChange={(e) => handleSecurityChange('requireNumbers', e.target.checked)}
                      />
                    }
                    label="Require Numbers"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.requireSpecialChars}
                        onChange={(e) => handleSecurityChange('requireSpecialChars', e.target.checked)}
                      />
                    }
                    label="Require Special Characters"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Retention (Days)"
                    type="number"
                    value={securitySettings.dataRetentionDays}
                    onChange={(e) => handleSecurityChange('dataRetentionDays', parseInt(e.target.value) || 365)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminSettings;