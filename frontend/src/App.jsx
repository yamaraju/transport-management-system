import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RoutesView from './pages/RoutesView';
import BusRegistration from './pages/BusRegistration';
import Payment from './pages/Payment';
import PaymentHistory from './pages/PaymentHistory';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageStaff from './pages/admin/ManageStaff';
import ManageBuses from './pages/admin/ManageBuses';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import ManageMaintenance from './pages/admin/ManageMaintenance';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="staff" element={<ManageStaff />} />
              <Route path="buses" element={<ManageBuses />} />
              <Route path="routes" element={<ManageRoutes />} />
              <Route path="payments" element={<ManageRegistrations />} />
              <Route path="maintenance" element={<ManageMaintenance />} />
              <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="routes" element={<RoutesView />} />
              <Route path="bus-registration" element={<BusRegistration />} />
              <Route path="payment" element={<Payment />} />
              <Route path="receipt" element={<PaymentHistory />} />
              <Route path="" element={<Navigate to="/student/dashboard" replace />} />
            </Route>

            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STAFF']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="routes" element={<RoutesView />} />
              <Route path="bus-registration" element={<BusRegistration />} />
              <Route path="payment" element={<Payment />} />
              <Route path="receipt" element={<PaymentHistory />} />
              <Route path="" element={<Navigate to="/staff/dashboard" replace />} />
            </Route>

            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
