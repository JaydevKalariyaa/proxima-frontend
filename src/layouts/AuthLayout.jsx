import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: alpha(theme.palette.primary.main, 0.01)
    }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
