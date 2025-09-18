import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Fade,
  Zoom,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGoHome = () => {
    navigate('/sales');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)
          `,
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }}
          >
            {/* 404 Number */}
            <Zoom in timeout={1200}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                  fontWeight: 900,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  mb: 2
                }}
              >
                404
              </Typography>
            </Zoom>

            {/* Main Message */}
            <Fade in timeout={1400}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Oops! Page Not Found
              </Typography>
            </Fade>

            <Fade in timeout={1600}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  maxWidth: '500px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                The page you're looking for seems to have vanished into the digital void. 
                Don't worry, even the best furniture showrooms have hidden corners!
              </Typography>
            </Fade>

            {/* Icon */}
            <Fade in timeout={1800}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SearchIcon
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3rem' },
                      color: theme.palette.primary.main,
                      opacity: 0.8
                    }}
                  />
                </Box>
              </Box>
            </Fade>

            {/* Action Buttons */}
            <Fade in timeout={2000}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    transition: 'all 0.3s ease',
                    minWidth: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                    }
                  }}
                >
                  Home Page
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    borderWidth: 2,
                    minWidth: { xs: '100%', sm: 'auto' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Go Back
                </Button>
              </Box>
            </Fade>

            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                opacity: 0.1,
                transform: 'rotate(15deg)'
              }}
            >
              <ConstructionIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                opacity: 0.1,
                transform: 'rotate(-15deg)'
              }}
            >
              <SearchIcon sx={{ fontSize: '2.5rem', color: theme.palette.secondary.main }} />
            </Box>
          </Paper>
        </Fade>

        {/* Footer Note */}
        <Fade in timeout={2200}>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mt: 3,
              color: theme.palette.text.secondary,
              opacity: 0.7,
              fontSize: '0.9rem'
            }}
          >
            Need help? Contact our support team or check your URL for typos.
          </Typography>
        </Fade>
      </Container>
    </Box>
  );
};

export default NotFound;
