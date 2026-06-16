import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    capacity: 40,
    model: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await API.get('/buses');
      setBuses(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load buses.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      busNumber: '',
      capacity: 40,
      model: '',
      status: 'ACTIVE',
    });
    setOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setIsEdit(true);
    setEditId(bus.id);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      model: bus.model,
      status: bus.status,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

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

    try {
      if (isEdit) {
        await API.put(`/buses/${editId}`, formData);
        setSuccess('Bus updated successfully!');
      } else {
        await API.post('/buses', formData);
        setSuccess('Bus created successfully with auto-allocated seats!');
      }
      fetchBuses();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save bus.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    try {
      await API.delete(`/buses/${id}`);
      setSuccess('Bus deleted successfully!');
      fetchBuses();
    } catch (err) {
      console.error(err);
      setError('Failed to delete bus. It might be associated with active passenger bookings.');
    }
  };

  if (loading && buses.length === 0) {
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
            Manage Buses
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Log transit vehicles, update seat capacities, and toggle fleet statuses.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Bus
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {buses.length === 0 ? (
        <Alert severity="info">No buses in system fleet yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Bus Code / Plate</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Seat Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fleet Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{bus.busNumber}</TableCell>
                  <TableCell>{bus.model}</TableCell>
                  <TableCell>{bus.capacity} Seats</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: bus.status === 'ACTIVE' ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                      }}
                    >
                      {bus.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEdit(bus)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(bus.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Update Bus Details' : 'Add New Bus'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                name="busNumber"
                label="Bus Number / License Plate"
                fullWidth
                required
                value={formData.busNumber}
                onChange={handleChange}
              />
              <TextField
                name="model"
                label="Bus Model (e.g. Mercedes Benz Coach)"
                fullWidth
                required
                value={formData.model}
                onChange={handleChange}
              />
              <TextField
                name="capacity"
                label="Total Seat Capacity"
                type="number"
                fullWidth
                required
                value={formData.capacity}
                onChange={handleChange}
                inputProps={{ min: 5, max: 100 }}
                helperText="Pre-allocates numbered seats automatically."
              />
              <TextField
                name="status"
                label="Status"
                select
                fullWidth
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="IN_MAINTENANCE">In Maintenance</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save Changes' : 'Create Bus'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageBuses;
