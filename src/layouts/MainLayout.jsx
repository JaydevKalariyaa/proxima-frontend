import React from 'react';
import { Box, useTheme, alpha, CircularProgress } from '@mui/material';
import { useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

const MainLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // Show loading while auth is being initialized
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Don't render header for public routes or if not authenticated
  const shouldShowHeader = !isPublicRoute && isAuthenticated;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: alpha(theme.palette.primary.main, 0.01)
    }}>
      {shouldShowHeader && <Header showProfile={true} />}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: shouldShowHeader ? { xs: 10, sm: 12 } : 0,
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
