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
  Avatar,
  Divider,
  Chip,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    addresses: []
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        addresses: user.addresses || []
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel editing
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        addresses: user.addresses || []
      });
    }
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordDialog(false);
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError('Please fill in all required fields');
      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress
    };

    setProfileData(prev => ({
      ...prev,
      addresses: [...prev.addresses, address]
    }));

    setNewAddress({
      type: 'home',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });

    setShowAddressDialog(false);
    setSuccess('Address added successfully!');
  };

  const handleDeleteAddress = (addressId) => {
    setProfileData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
    setSuccess('Address deleted successfully!');
  };

  const handleSetDefaultAddress = (addressId) => {
    setProfileData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    }));
    setSuccess('Default address updated!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderProfileTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Button
          variant={editMode ? 'outlined' : 'contained'}
          startIcon={editMode ? <CancelIcon /> : <EditIcon />}
          onClick={handleEditToggle}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                backgroundColor: theme.palette.primary.main,
                margin: '0 auto 16px'
              }}
            >
              {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
            </Avatar>
            {editMode && (
              <Button variant="outlined" size="small">
                Change Photo
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!editMode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={!editMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!editMode}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={profileData.gender}
                  label="Gender"
                  onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {editMode && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleProfileUpdate}
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleEditToggle}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  const renderAddressesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddressDialog(true)}
        >
          Add New Address
        </Button>
      </Box>

      {profileData.addresses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LocationIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No addresses added yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first address to make checkout faster
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddressDialog(true)}
          >
            Add Address
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {profileData.addresses.map((address) => (
            <Grid item xs={12} md={6} key={address.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={address.type === 'home' ? 'Home' : 'Work'}
                      color="primary"
                      size="small"
                    />
                    {address.isDefault && (
                      <Chip
                        label="Default"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {address.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {address.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {address.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.city}, {address.state} {address.pincode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.country}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {!address.isDefault && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSetDefaultAddress(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderSecurityTab = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        Security Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your password to keep your account secure
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security to your account
              </Typography>
            </Box>
            <Switch />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Login Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified when someone logs into your account
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permanently delete your account and all data
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderPreferencesTab = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        Preferences
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Email Notifications
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Order updates and tracking"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Promotional offers and deals"
            />
            <FormControlLabel
              control={<Switch />}
              label="Newsletter and blog updates"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Account security alerts"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Privacy Settings
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Allow personalized recommendations"
            />
            <FormControlLabel
              control={<Switch />}
              label="Share data with third-party services"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show profile to other users"
            />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Language & Region
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select value="en" label="Language">
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="ta">Tamil</MenuItem>
                  <MenuItem value="te">Telugu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select value="inr" label="Currency">
                  <MenuItem value="inr">Indian Rupee (₹)</MenuItem>
                  <MenuItem value="usd">US Dollar ($)</MenuItem>
                  <MenuItem value="eur">Euro (€)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to view your profile.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    backgroundColor: theme.palette.primary.main,
                    margin: '0 auto 16px'
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                <ListItem
                  button
                  selected={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  button
                  selected={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                >
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Addresses" />
                </ListItem>
                <ListItem
                  button
                  selected={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Security" />
                </ListItem>
                <ListItem
                  button
                  selected={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Preferences" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {activeTab === 0 && renderProfileTab()}
              {activeTab === 1 && renderAddressesTab()}
              {activeTab === 2 && renderSecurityTab()}
              {activeTab === 3 && renderPreferencesTab()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog
        open={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Type</InputLabel>
                <Select
                  value={newAddress.type}
                  label="Address Type"
                  onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={newAddress.address}
                onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                }
                label="Set as default address"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddressDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddAddress}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
          </Typography>
          <Typography variant="body2" color="error">
            Please note: This will delete all your orders, addresses, and account information.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setShowDeleteDialog(false);
              // TODO: Implement account deletion
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
