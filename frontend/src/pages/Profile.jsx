import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';

const Profile = () => {
  const { user, updateProfile, refreshProfile } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isEditing) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setUsername(user.username || '');
    }
  }, [user, isEditing]);

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(name, phone, username);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setUsername(user.username || '');
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your personal account details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <Avatar
                sx={{
                  bgcolor: '#7c4dff',
                  width: 80,
                  height: 80,
                  fontSize: '32px',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="secondary" sx={{ fontWeight: 600, mb: 2 }}>
                {user?.role ? user.role.substring(5) : ''}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary" align="left" sx={{ mb: 1 }}>
                <strong>ID/Username:</strong> {user?.username}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="left" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="left">
                <strong>Facility Status:</strong> {user?.registered ? 'Registered' : 'Not Registered'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {isEditing ? 'Edit Profile Details' : 'Profile Details'}
                </Typography>
                {!isEditing && (
                  <Button variant="outlined" color="secondary" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                )}
              </Box>

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

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
                <TextField
                  label="Username / ID"
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />

                {isEditing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
