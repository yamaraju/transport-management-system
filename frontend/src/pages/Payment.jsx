import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
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
  CircularProgress,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';
import { Payment as PaymentIcon, Lock as SecurityIcon } from '@mui/icons-material';

const Payment = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.state && location.state.registration) {
      setRegistration(location.state.registration);
    } else {
      fetchActiveRegistration();
    }
  }, [location]);

  const fetchActiveRegistration = async () => {
    setLoading(true);
    try {
      const response = await API.get('/registrations/my');
      const approvedReg = response.data.find(r => r.status === 'APPROVED');
      if (approvedReg) {
        setRegistration(approvedReg);
      } else {
        setError('No active approved registration found for payment.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load registration details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!registration) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        registrationId: registration.id,
        amount: registration.route.fare,
        paymentMethod: paymentMethod,
      };

      await API.post('/payments', payload);
      setSuccess('Payment processed successfully! Your booking is confirmed.');
      setTimeout(() => {
        navigate(user.role === 'ROLE_STUDENT' ? '/student/dashboard' : '/staff/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!registration && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Fee Payment
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Pay transport fees securely to finalize your booking
        </Typography>
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

      {registration ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Booking Summary
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Route</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Route {registration.route.routeNumber}</Typography>
                    <Typography variant="caption" color="textSecondary">({registration.route.origin} to {registration.route.destination})</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Stop</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{registration.boardingPoint.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Seat / Bus</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Seat {registration.seat?.seatNumber} ({registration.bus?.busNumber})
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Amount Due:</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00e5ff' }}>
                    ${registration.route.fare}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handlePayment}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Payment Information
                  </Typography>

                  <TextField
                    label="Payment Method"
                    select
                    fullWidth
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    <MenuItem value="CARD">Credit/Debit Card</MenuItem>
                    <MenuItem value="UPI">UPI (Unified Payments Interface)</MenuItem>
                    <MenuItem value="NET_BANKING">Net Banking</MenuItem>
                  </TextField>

                  {paymentMethod === 'CARD' && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Card Number"
                          fullWidth
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                          placeholder="1234 5678 9101 1121"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Expiry Date"
                          fullWidth
                          required
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value.substring(0, 5))}
                          placeholder="MM/YY"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="CVV"
                          type="password"
                          fullWidth
                          required
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          placeholder="123"
                        />
                      </Grid>
                    </Grid>
                  )}

                  {paymentMethod === 'UPI' && (
                    <TextField
                      label="UPI ID"
                      fullWidth
                      required
                      placeholder="username@bank"
                      sx={{ mb: 2 }}
                    />
                  )}

                  {paymentMethod === 'NET_BANKING' && (
                    <TextField
                      label="Select Bank"
                      select
                      fullWidth
                      required
                      value="CHASE"
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="CHASE">Chase Bank</MenuItem>
                      <MenuItem value="BOA">Bank of America</MenuItem>
                      <MenuItem value="WELLS">Wells Fargo</MenuItem>
                    </TextField>
                  )}

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, color: 'text.secondary' }}>
                    <SecurityIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">Secured 256-bit SSL encrypted transaction</Typography>
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={<PaymentIcon />}
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : `Pay $${registration.route.fare}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="warning">No approved registration requires payment at this time.</Alert>
      )}
    </Container>
  );
};

export default Payment;
