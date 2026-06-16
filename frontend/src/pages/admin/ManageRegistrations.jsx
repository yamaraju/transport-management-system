import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Box,
  Card,
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
  Tabs,
  Tab,
} from '@mui/material';
import { Check as ApproveIcon, Close as RejectIcon } from '@mui/icons-material';

const ManageRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const regResponse = await API.get('/registrations');
      setRegistrations(regResponse.data);

      const payResponse = await API.get('/payments');
      setPayments(payResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load registrations and payments details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      await API.put(`/registrations/${id}/status`, { status });
      setSuccess(`Registration successfully ${status.toLowerCase()}!`);
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update registration status.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && registrations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const pendingRegs = registrations.filter(r => r.status === 'PENDING');
  const otherRegs = registrations.filter(r => r.status !== 'PENDING');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Registrations & Financials
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review pending transport registrations, approve passenger listings, and view payments.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
          <Tab label={`Pending Approvals (${pendingRegs.length})`} />
          <Tab label="Registration History" />
          <Tab label="Payment Transactions" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Card sx={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Route Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Boarding stop</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bus / Seat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRegs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No pending registrations to approve.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRegs.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{reg.user?.name} ({reg.user?.username})</TableCell>
                      <TableCell>{reg.user?.role ? reg.user.role.substring(5) : ''}</TableCell>
                      <TableCell>Route {reg.route?.routeNumber}</TableCell>
                      <TableCell>{reg.boardingPoint?.name}</TableCell>
                      <TableCell>
                        {reg.bus && reg.seat ? `${reg.bus.busNumber} / Seat ${reg.seat.seatNumber}` : 'Pending allocation'}
                      </TableCell>
                      <TableCell>{reg.registrationDate}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleUpdateStatus(reg.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<RejectIcon />}
                            onClick={() => handleUpdateStatus(reg.id, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Route Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Boarding stop</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bus / Seat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherRegs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No registration records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  otherRegs.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{reg.user?.name} ({reg.user?.username})</TableCell>
                      <TableCell>Route {reg.route?.routeNumber}</TableCell>
                      <TableCell>{reg.boardingPoint?.name}</TableCell>
                      <TableCell>
                        {reg.bus && reg.seat ? `${reg.bus.busNumber} / Seat ${reg.seat.seatNumber}` : 'Pending allocation'}
                      </TableCell>
                      <TableCell>{reg.registrationDate}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            color: reg.status === 'APPROVED' ? '#2e7d32' : '#d32f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {reg.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No payment transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.transactionId}</TableCell>
                      <TableCell>{p.registration?.user?.name} ({p.registration?.user?.username})</TableCell>
                      <TableCell>Route {p.registration?.route?.routeNumber}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>${p.amount}</TableCell>
                      <TableCell>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{p.paymentMethod}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            color: p.status === 'SUCCESS' ? '#2e7d32' : '#d32f2f',
                            fontWeight: 'bold',
                          }}
                        >
                          {p.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  );
};

export default ManageRegistrations;
