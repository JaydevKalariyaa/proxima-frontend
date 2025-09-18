import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';

const Loader = ({ message = "Loading..." }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        zIndex: theme.zIndex.modal + 1,
        backdropFilter: 'blur(4px)'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 120,
          height: 120
        }}
      >
        <CircularProgress
          size={100}
          thickness={2}
          sx={{
            color: theme.palette.primary.main,
            position: 'absolute'
          }}
        />
        <Box
          component="img"
          src={'https://proximabeyonddecor.in/images/photo/favicon.png'}
          alt="Proxima"
          sx={{
            width: 50,
            height: 50,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.5,
              },
              '50%': {
                transform: 'scale(1.05)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.5,
              },
            },
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: theme.palette.text.primary,
          fontWeight: 500,
          textAlign: 'center',
          animation: 'fadeInOut 1.5s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%': {
              opacity: 0.5,
            },
            '50%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0.5,
            },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
