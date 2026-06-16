import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
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
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await API.get('/payments/history');
      setPayments(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load transaction history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Payment History
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.role === 'ROLE_ADMIN'
            ? 'Track all student and staff financial collections'
            : 'Track your personal fee transactions and download receipts'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {payments.length === 0 ? (
        <Alert severity="info">No payment transactions have been logged.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                {user.role === 'ROLE_ADMIN' && <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>}
                <TableCell sx={{ fontWeight: 'bold' }}>Route Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{payment.transactionId}</TableCell>
                  {user.role === 'ROLE_ADMIN' && (
                    <TableCell>{payment.registration.user.name} ({payment.registration.user.username})</TableCell>
                  )}
                  <TableCell>Route {payment.registration.route.routeNumber}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: payment.status === 'SUCCESS' ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                      }}
                    >
                      {payment.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'SUCCESS' ? (
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<ReceiptIcon />}
                        href={`http://localhost:8080/api/receipts/${payment.id}/download`}
                        target="_blank"
                      >
                        Receipt
                      </Button>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PaymentHistory;
