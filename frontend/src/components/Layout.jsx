import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DirectionsBus as BusIcon,
  Route as RouteIcon,
  People as PeopleIcon,
  Assignment as RegIcon,
  Payment as PaymentIcon,
  Build as MaintenanceIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    if (user.role === 'ROLE_ADMIN') {
      navigate('/admin/dashboard');
    } else if (user.role === 'ROLE_STUDENT') {
      navigate('/student/profile');
    } else if (user.role === 'ROLE_STAFF') {
      navigate('/staff/profile');
    }
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    if (!user) return [];
    if (user.role === 'ROLE_ADMIN') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
        { text: 'Staff Members', icon: <PeopleIcon />, path: '/admin/staff' },
        { text: 'Manage Buses', icon: <BusIcon />, path: '/admin/buses' },
        { text: 'Manage Routes', icon: <RouteIcon />, path: '/admin/routes' },
        { text: 'Registrations & Payments', icon: <RegIcon />, path: '/admin/payments' },
        { text: 'Maintenance Logs', icon: <MaintenanceIcon />, path: '/admin/maintenance' },
      ];
    } else if (user.role === 'ROLE_STUDENT') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
        { text: 'My Profile', icon: <ProfileIcon />, path: '/student/profile' },
        { text: 'Available Routes', icon: <RouteIcon />, path: '/student/routes' },
        { text: 'Register for Bus', icon: <RegIcon />, path: '/student/bus-registration' },
        { text: 'Payment History', icon: <PaymentIcon />, path: '/student/payment' },
      ];
    } else if (user.role === 'ROLE_STAFF') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/staff/dashboard' },
        { text: 'My Profile', icon: <ProfileIcon />, path: '/staff/profile' },
        { text: 'Available Routes', icon: <RouteIcon />, path: '/staff/routes' },
        { text: 'Register for Bus', icon: <RegIcon />, path: '/staff/bus-registration' },
        { text: 'Payment History', icon: <PaymentIcon />, path: '/staff/payment' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#7c4dff' }}>
          TMS PANEL
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                  color: isActive ? '#00e5ff' : '#9aa0a6',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#00e5ff' : '#9aa0a6', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogoutClick}
            sx={{
              borderRadius: '8px',
              color: '#f44336',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: '40px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0b10' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(10, 11, 16, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            {menuItems.find(item => location.pathname === item.path)?.text || 'Transport Management'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, color: '#9aa0a6' }}>
              {user?.name} ({user?.role ? user.role.substring(5) : ''})
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: '#7c4dff', width: 36, height: 36, fontSize: '15px' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  bgcolor: '#12131e',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                  mt: 1.5,
                }
              }}
            >
              <MenuItem onClick={handleProfileClick} sx={{ fontSize: '14px' }}>My Account</MenuItem>
              <MenuItem onClick={handleLogoutClick} sx={{ fontSize: '14px', color: '#f44336' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#12131e', borderRight: '1px solid rgba(255, 255, 255, 0.05)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#12131e', borderRight: '1px solid rgba(255, 255, 255, 0.05)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
