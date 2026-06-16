import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  DirectionsBus as BusIcon,
  Route as RouteIcon,
  Assignment as RegIcon,
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: <PeopleIcon sx={{ fontSize: 40, color: '#7c4dff' }} />, path: '/admin/students' },
    { title: 'Total Staff', value: stats?.totalStaff || 0, icon: <PeopleIcon sx={{ fontSize: 40, color: '#00e5ff' }} />, path: '/admin/staff' },
    { title: 'Buses Managed', value: stats?.totalBuses || 0, icon: <BusIcon sx={{ fontSize: 40, color: '#4caf50' }} />, path: '/admin/buses' },
    { title: 'Routes Active', value: stats?.totalRoutes || 0, icon: <RouteIcon sx={{ fontSize: 40, color: '#ff9800' }} />, path: '/admin/routes' },
    { title: 'Registrations', value: stats?.totalRegistrations || 0, icon: <RegIcon sx={{ fontSize: 40, color: '#e91e63' }} />, path: '/admin/payments' },
    { title: 'Revenue Collected', value: `$${stats?.totalRevenue || 0}`, icon: <MoneyIcon sx={{ fontSize: 40, color: '#ffeb3b' }} />, path: '/admin/payments' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Admin Console
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Overview of transit activities, user registers, and service metrics.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => navigate('/admin/buses')}>
              Add New Bus
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => navigate('/admin/routes')}>
              Add New Route
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="info" onClick={() => navigate('/admin/maintenance')}>
              Log Bus Maintenance
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
