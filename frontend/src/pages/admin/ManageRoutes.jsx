import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [routeNumber, setRouteNumber] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [fare, setFare] = useState('');
  const [boardingPoints, setBoardingPoints] = useState([
    { name: '', pickupTime: '07:30', dropTime: '17:30' }
  ]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await API.get('/routes');
      setRoutes(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setRouteNumber('');
    setOrigin('');
    setDestination('');
    setDistance('');
    setFare('');
    setBoardingPoints([{ name: '', pickupTime: '07:30', dropTime: '17:30' }]);
    setOpen(true);
  };

  const handleOpenEdit = (route) => {
    setIsEdit(true);
    setEditId(route.id);
    setRouteNumber(route.routeNumber);
    setOrigin(route.origin);
    setDestination(route.destination);
    setDistance(route.distance.toString());
    setFare(route.fare.toString());
    
    const mappedStops = route.boardingPoints.map(bp => ({
      name: bp.name,
      pickupTime: bp.pickupTime.substring(0, 5),
      dropTime: bp.dropTime.substring(0, 5)
    }));
    setBoardingPoints(mappedStops.length > 0 ? mappedStops : [{ name: '', pickupTime: '07:30', dropTime: '17:30' }]);
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleAddStop = () => {
    setBoardingPoints([...boardingPoints, { name: '', pickupTime: '07:30', dropTime: '17:30' }]);
  };

  const handleRemoveStop = (idx) => {
    const list = [...boardingPoints];
    list.splice(idx, 1);
    setBoardingPoints(list);
  };

  const handleStopChange = (idx, field, value) => {
    const list = [...boardingPoints];
    list[idx][field] = value;
    setBoardingPoints(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formattedStops = boardingPoints.map(bp => ({
      name: bp.name,
      pickupTime: bp.pickupTime.length === 5 ? `${bp.pickupTime}:00` : bp.pickupTime,
      dropTime: bp.dropTime.length === 5 ? `${bp.dropTime}:00` : bp.dropTime
    }));

    const payload = {
      routeNumber,
      origin,
      destination,
      distance: parseFloat(distance),
      fare: parseFloat(fare),
      boardingPoints: formattedStops
    };

    try {
      if (isEdit) {
        await API.put(`/routes/${editId}`, payload);
        setSuccess('Route updated successfully!');
      } else {
        await API.post('/routes', payload);
        setSuccess('Route created successfully!');
      }
      fetchRoutes();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save route.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route? All associated registrations will be affected.')) return;
    try {
      await API.delete(`/routes/${id}`);
      setSuccess('Route deleted successfully!');
      fetchRoutes();
    } catch (err) {
      console.error(err);
      setError('Failed to delete route.');
    }
  };

  if (loading && routes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Manage Routes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Set transport lines, fare structures, and schedule boarding stops.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Route
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {routes.length === 0 ? (
        <Alert severity="info">No routes configured yet.</Alert>
      ) : (
        routes.map((route) => (
          <Accordion
            key={route.id}
            sx={{
              mb: 2,
              background: 'rgba(18, 19, 30, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Route {route.routeNumber}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    ({route.origin} → {route.destination})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={`${route.distance} km`} size="small" variant="outlined" color="info" />
                  <Chip label={`$${route.fare}`} size="small" color="secondary" />
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleOpenEdit(route); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(route.id); }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#7c4dff' }}>
                Boarding Points & Timings
              </Typography>
              {route.boardingPoints && route.boardingPoints.length > 0 ? (
                <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Stop Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Morning Pick-up</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Evening Drop-off</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {route.boardingPoints.map((bp) => (
                        <TableRow key={bp.id}>
                          <TableCell>{bp.name}</TableCell>
                          <TableCell>{bp.pickupTime}</TableCell>
                          <TableCell>{bp.dropTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No stops configured.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Update Route Details' : 'Create New Route'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Route Code (e.g. R105)"
                  fullWidth
                  required
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Origin Campus"
                  fullWidth
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Destination stop"
                  fullWidth
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Distance (km)"
                  type="number"
                  fullWidth
                  required
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  inputProps={{ step: 'any' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fare Price ($)"
                  type="number"
                  fullWidth
                  required
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  inputProps={{ step: 'any' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#7c4dff' }}>
                    Stops & Boarding Points
                  </Typography>
                  <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddStop}>
                    Add Stop
                  </Button>
                </Box>

                {boardingPoints.map((bp, index) => (
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }} key={index} alignItems="center">
                    <TextField
                      label={`Stop #${index + 1} Name`}
                      required
                      value={bp.name}
                      onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <TextField
                      label="Pick-up Time"
                      type="time"
                      required
                      value={bp.pickupTime}
                      onChange={(e) => handleStopChange(index, 'pickupTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                    />
                    <TextField
                      label="Drop-off Time"
                      type="time"
                      required
                      value={bp.dropTime}
                      onChange={(e) => handleStopChange(index, 'dropTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveStop(index)}
                      disabled={boardingPoints.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save Changes' : 'Create Route'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageRoutes;
