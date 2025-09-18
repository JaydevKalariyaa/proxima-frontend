import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

const Layout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: alpha(theme.palette.primary.main, 0.01)
    }}>
      <Header showProfile={!isPublicRoute} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 9, sm: 10 }, // Account for fixed header height
          px: { xs: 2, sm: 3 }, // 16px for mobile, 24px for desktop
          pb: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
