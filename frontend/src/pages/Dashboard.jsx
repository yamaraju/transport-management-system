import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  DirectionsBus as BusIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as SuccessIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      await refreshProfile();
      const regResponse = await API.get('/registrations/my');
      setRegistrations(regResponse.data);

      const payResponse = await API.get('/payments/history');
      setPayments(payResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard information');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardContent = () => {
    const activeReg = registrations.find(r => r.status === 'PENDING' || r.status === 'APPROVED');
    const rejectedReg = registrations.find(r => r.status === 'REJECTED');

    if (activeReg) {
      const isApproved = activeReg.status === 'APPROVED';
      const hasPaid = payments.some(p => p.registration.id === activeReg.id && p.status === 'SUCCESS');
      const activePayment = payments.find(p => p.registration.id === activeReg.id && p.status === 'SUCCESS');

      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, mb: 4 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  {isApproved ? (
                    hasPaid ? (
                      <SuccessIcon color="success" sx={{ fontSize: 40 }} />
                    ) : (
                      <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                    )
                  ) : (
                    <PendingIcon color="info" sx={{ fontSize: 40 }} />
                  )}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Registration Status: {activeReg.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {isApproved
                        ? hasPaid
                          ? 'Your seat booking is active and confirmed!'
                          : 'Approved! Please proceed to complete the payment.'
                        : 'Awaiting admin approval and seat allocation.'}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Route Code</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.route.routeNumber}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Boarding Point</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.boardingPoint.name}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Boarding Time</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.boardingPoint.pickupTime}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Bus Code</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.bus ? activeReg.bus.busNumber : 'Pending allocation'}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Seat Number</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.seat ? activeReg.seat.seatNumber : 'Pending allocation'}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="textSecondary">Term Fee</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>${activeReg.route.fare}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  {isApproved && !hasPaid && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PaymentIcon />}
                      onClick={() => navigate(user.role === 'ROLE_STUDENT' ? '/student/payment' : '/staff/payment', { state: { registration: activeReg } })}
                    >
                      Make Payment
                    </Button>
                  )}
                  {hasPaid && activePayment && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ReceiptIcon />}
                      href={`http://localhost:8080/api/receipts/${activePayment.id}/download`}
                      target="_blank"
                    >
                      Download PDF Receipt
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Route Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Origin</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.route.origin}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Destination</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.route.destination}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Total Distance</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activeReg.route.distance} km</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }

    if (rejectedReg) {
      return (
        <Card sx={{ p: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <RejectedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Registration Rejected
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Your registration request for the transport facility was rejected by the administrator. Please try creating a new request.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(user.role === 'ROLE_STUDENT' ? '/student/bus-registration' : '/staff/bus-registration')}
            >
              New Registration Request
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ p: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 5 }}>
          <BusIcon sx={{ fontSize: 70, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Register for Bus Facility
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}>
            Get access to available routes, boarding points, bus selections, and book your preferred seat. Complete your registration process in a few easy steps.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(user.role === 'ROLE_STUDENT' ? '/student/bus-registration' : '/staff/bus-registration')}
          >
            Start Registration Flow
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Check your transport details, pay term fees, and download receipts.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {getDashboardContent()}
    </Container>
  );
};

export default Dashboard;
