import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
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
  MenuItem,
} from '@mui/material';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: '',
    role: 'ROLE_STUDENT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(
        formData.username,
        formData.password,
        formData.email,
        formData.role,
        formData.name,
        formData.phone
      );
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err);
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
                REGISTER
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create your account for transport facility
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
                name="name"
                label="Full Name"
                fullWidth
                required
                variant="outlined"
                margin="dense"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                name="username"
                label="Username (Student/Staff ID)"
                fullWidth
                required
                variant="outlined"
                margin="dense"
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                required
                variant="outlined"
                margin="dense"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                variant="outlined"
                margin="dense"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                name="role"
                label="Register As"
                select
                fullWidth
                required
                variant="outlined"
                margin="dense"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                <MenuItem value="ROLE_STAFF">Staff / Faculty</MenuItem>
              </TextField>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                required
                variant="outlined"
                margin="dense"
                value={formData.password}
                onChange={handleChange}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
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

export default Register;
