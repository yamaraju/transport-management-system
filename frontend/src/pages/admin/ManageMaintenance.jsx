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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { Add as AddIcon, CheckCircle as DoneIcon } from '@mui/icons-material';

const ManageMaintenance = () => {
  const [records, setRecords] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [open, setOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.get('/maintenance');
      setRecords(response.data);

      const busesResponse = await API.get('/buses');
      setBuses(busesResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load maintenance logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedBus('');
    setDescription('');
    setCost('');
    setMaintenanceDate(new Date().toISOString().substring(0, 10));
    setCompletionDate('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      busId: selectedBus,
      description,
      cost: parseFloat(cost),
      maintenanceDate,
      completionDate: completionDate || null,
    };

    try {
      await API.post('/maintenance', payload);
      setSuccess('Maintenance record logged successfully!');
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to log maintenance record.');
    }
  };

  const handleComplete = async (recordId) => {
    const today = new Date().toISOString().substring(0, 10);
    setError('');
    setSuccess('');
    try {
      await API.put(`/maintenance/${recordId}/complete`, { completionDate: today });
      setSuccess('Maintenance marked as completed!');
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to update completion status.');
    }
  };

  if (loading && records.length === 0) {
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
            Bus Maintenance
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Log servicing actions, record costs, and track fleet health status.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Log Maintenance
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {records.length === 0 ? (
        <Alert severity="info">No bus maintenance events have been logged.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Bus Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Service Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Completion Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{rec.bus.busNumber}</TableCell>
                  <TableCell>{rec.description}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${rec.cost}</TableCell>
                  <TableCell>{rec.maintenanceDate}</TableCell>
                  <TableCell>{rec.completionDate || '-'}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: rec.completionDate ? '#2e7d32' : '#ff9800',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                      }}
                    >
                      {rec.completionDate ? 'COMPLETED' : 'IN PROGRESS'}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {!rec.completionDate && (
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        startIcon={<DoneIcon />}
                        onClick={() => handleComplete(rec.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Log Bus Maintenance</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Select Bus"
                select
                fullWidth
                required
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
              >
                {buses.map((bus) => (
                  <MenuItem key={bus.id} value={bus.id}>
                    {bus.busNumber} ({bus.model})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Servicing Description"
                fullWidth
                required
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                label="Maintenance Cost ($)"
                type="number"
                fullWidth
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                inputProps={{ step: 'any', min: 0 }}
              />
              <TextField
                label="Scheduled Date"
                type="date"
                fullWidth
                required
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Completion Date (Optional)"
                type="date"
                fullWidth
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Log Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageMaintenance;
