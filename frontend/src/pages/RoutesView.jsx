import React, { useEffect, useState } from 'react';
import API from '../services/api';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, DirectionsBus as BusIcon } from '@mui/icons-material';

const RoutesView = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await API.get('/routes');
      setRoutes(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load routes. Please try again later.');
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
          Transit Routes
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View all available transportation routes, fares, distances, and boarding points.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {routes.length === 0 ? (
        <Alert severity="info">No transport routes are currently available.</Alert>
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
                  <BusIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Route {route.routeNumber}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    ({route.origin} → {route.destination})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={`${route.distance} km`} size="small" variant="outlined" color="info" />
                  <Chip label={`$${route.fare}`} size="small" color="secondary" />
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
                  No boarding points defined for this route.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default RoutesView;
