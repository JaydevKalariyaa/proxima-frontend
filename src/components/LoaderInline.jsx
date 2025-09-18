import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const LoaderInline = ({ size = 'medium', message }) => {
  const theme = useTheme();

  const sizes = {
    small: {
      container: 40,
      spinner: 36,
      icon: 20,
      fontSize: '0.875rem'
    },
    medium: {
      container: 60,
      spinner: 50,
      icon: 28,
      fontSize: '1rem'
    },
    large: {
      container: 80,
      spinner: 70,
      icon: 36,
      fontSize: '1.125rem'
    }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentSize.container,
          height: currentSize.container
        }}
      >
        <CircularProgress
          size={currentSize.spinner}
          thickness={2}
          sx={{
            color: theme.palette.primary.main,
            position: 'absolute'
          }}
        />
        <Box
          component="img"
          src="/favicon.png"
          alt="Proxima"
          sx={{
            width: currentSize.icon,
            height: currentSize.icon,
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
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: currentSize.fontSize,
            animation: 'fadeInOut 1.5s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0.5 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.5 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoaderInline;
