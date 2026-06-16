import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import API from '../../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess('Reset link generated! Since email dispatch is disabled, please check your backend server console logs for the reset token or link.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #1a1b2f 0%, #0a0b10 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#7c4dff', mb: 1 }}>
                RECOVER
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter your email to reset your password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, mt: 3 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/reset-password" color="secondary" variant="body2" sx={{ fontWeight: 'bold' }}>
                Have a reset token? Reset password here
              </Link>
              <Typography variant="body2" color="textSecondary">
                Back to{' '}
                <Link component={RouterLink} to="/login" color="secondary" sx={{ fontWeight: 'bold' }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
