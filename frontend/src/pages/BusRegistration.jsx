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
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { DirectionsBus as BusIcon, EventSeat as SeatIcon } from '@mui/icons-material';

const steps = ['Select Route & Stop', 'Select Bus & Seat', 'Confirm Request'];

const BusRegistration = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [seats, setSeats] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkExistingRegistration();
  }, []);

  const checkExistingRegistration = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      const response = await API.get('/registrations/my');
      const hasActive = response.data.some(r => r.status === 'PENDING' || r.status === 'APPROVED');
      if (hasActive) {
        navigate(user.role === 'ROLE_STUDENT' ? '/student/dashboard' : '/staff/dashboard');
      } else {
        const routesResponse = await API.get('/routes');
        setRoutes(routesResponse.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to initiate registration process');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (routeId) => {
    setSelectedRoute(routeId);
    setSelectedStop('');
  };

  const handleNextStep1 = async () => {
    if (!selectedRoute || !selectedStop) {
      setError('Please select a route and boarding point.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const busesResponse = await API.get('/buses');
      setBuses(busesResponse.data.filter(b => b.status === 'ACTIVE'));
      setActiveStep(1);
    } catch (err) {
      console.error(err);
      setError('Failed to load available buses');
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = async (busId) => {
    setSelectedBus(busId);
    setSelectedSeat('');
    setLoadingSeats(true);
    try {
      const response = await API.get(`/buses/${busId}/seats`);
      setSeats(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load bus seats');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleNextStep2 = () => {
    if (!selectedBus || !selectedSeat) {
      setError('Please select a bus and seat.');
      return;
    }
    setError('');
    setActiveStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await API.post('/registrations', {
        routeId: selectedRoute,
        boardingPointId: selectedStop,
        busId: selectedBus,
        seatId: selectedSeat.id,
      });
      navigate(user.role === 'ROLE_STUDENT' ? '/student/dashboard' : '/staff/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit registration request.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const routeDetail = routes.find(r => r.id === selectedRoute);
  const stopDetail = routeDetail?.boardingPoints?.find(bp => bp.id === selectedStop);
  const busDetail = buses.find(b => b.id === selectedBus);

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select your transit route
            </Typography>
            <TextField
              label="Select Route"
              select
              fullWidth
              value={selectedRoute}
              onChange={(e) => handleRouteSelect(e.target.value)}
              sx={{ mb: 3 }}
            >
              {routes.map((route) => (
                <MenuItem key={route.id} value={route.id}>
                  Route {route.routeNumber} ({route.origin} → {route.destination}) - ${route.fare}
                </MenuItem>
              ))}
            </TextField>

            {selectedRoute && (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Select your boarding point
                </Typography>
                <TextField
                  label="Select Boarding Point"
                  select
                  fullWidth
                  value={selectedStop}
                  onChange={(e) => setSelectedStop(e.target.value)}
                >
                  {routeDetail?.boardingPoints?.map((bp) => (
                    <MenuItem key={bp.id} value={bp.id}>
                      {bp.name} (Pick-up: {bp.pickupTime} / Drop-off: {bp.dropTime})
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep1}
                disabled={!selectedRoute || !selectedStop}
              >
                Next Step
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Bus Service
            </Typography>
            <TextField
              label="Select Bus"
              select
              fullWidth
              value={selectedBus}
              onChange={(e) => handleBusSelect(e.target.value)}
              sx={{ mb: 3 }}
            >
              {buses.map((bus) => (
                <MenuItem key={bus.id} value={bus.id}>
                  {bus.busNumber} ({bus.model}) - Capacity: {bus.capacity}
                </MenuItem>
              ))}
            </TextField>

            {loadingSeats && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {selectedBus && !loadingSeats && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                  Select Seat Layout (2x2 Grid)
                </Typography>

                <Paper
                  sx={{
                    p: 4,
                    maxWidth: '450px',
                    mx: 'auto',
                    border: '2px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontStyle: 'italic' }}>
                      [Front / Driver]
                    </Typography>
                    <Box sx={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                      🛞
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    {seats.map((seat, index) => {
                      const isAllocated = seat.status === 'ALLOCATED';
                      const isSelected = selectedSeat.id === seat.id;

                      return (
                        <React.Fragment key={seat.id}>
                          <Grid item xs={2.5}>
                            <Button
                              variant={isSelected ? 'contained' : 'outlined'}
                              color={isAllocated ? 'error' : isSelected ? 'secondary' : 'success'}
                              disabled={isAllocated}
                              onClick={() => setSelectedSeat(seat)}
                              sx={{
                                minWidth: '45px',
                                height: '45px',
                                p: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                borderStyle: isAllocated ? 'solid' : 'dashed',
                              }}
                            >
                              <SeatIcon sx={{ fontSize: 20 }} />
                              <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 'bold' }}>
                                {seat.seatNumber}
                              </Typography>
                            </Button>
                          </Grid>
                          {(index + 1) % 4 === 2 && (
                            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Box sx={{ width: 1, borderLeft: '1px dashed rgba(255,255,255,0.05)', height: '100%' }} />
                            </Grid>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                </Paper>
                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#2e7d32', borderRadius: '4px' }} />
                    <Typography variant="caption">Available</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#d32f2f', borderRadius: '4px' }} />
                    <Typography variant="caption">Booked</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#00e5ff', borderRadius: '4px' }} />
                    <Typography variant="caption">Selected</Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep2}
                disabled={!selectedBus || !selectedSeat}
              >
                Next Step
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Verify details and submit request
            </Typography>

            <Paper sx={{ p: 3, border: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.1)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Passenger Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">User Role</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.role ? user.role.substring(5) : ''}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Route Selected</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Route {routeDetail?.routeNumber}</Typography>
                  <Typography variant="caption" color="textSecondary">({routeDetail?.origin} to {routeDetail?.destination})</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Boarding Point Stop</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{stopDetail?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">Morning Pick-up: {stopDetail?.pickupTime}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Vehicle Allocated</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{busDetail?.busNumber} ({busDetail?.model})</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Seat Reserved</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedSeat?.seatNumber}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ color: '#00e5ff', fontWeight: 'bold' }}>
                    Total Term Fare: ${routeDetail?.fare}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={handleBack} disabled={loading}>
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Registration'}
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading && activeStep === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Facility Registration
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Complete the transport registration steps below.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ p: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BusRegistration;
