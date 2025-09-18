import React from 'react';
import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Avatar,
  Grid,
  Divider,
  useTheme,
  alpha,
  Fade,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        px: 3,
        py: 2,
      
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }
      }}>
        <Tooltip title="Go Back" arrow>
          <IconButton
            onClick={handleBack}
            size="medium"
            sx={{ 
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: 'translateX(-2px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            User Profile
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
       
        minHeight: 'calc(100vh - 80px)'
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                  mb: 4
                }}
              >
                Manage your account information and preferences
              </Typography>

          <Grid container spacing={4}>
            {/* Profile Overview Card */}
            <Grid size={{xs:12,md:4}}>
              <Fade in timeout={800}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
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
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    {/* Avatar */}
                    <Box sx={{ mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 2,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '2.5rem',
                          fontWeight: 700
                        }}
                      >
                        {getInitials(user?.full_name || user?.name || 'User')}
                      </Avatar>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1
                        }}
                      >
                        {user?.full_name || user?.name || 'User'}
                      </Typography>
                      
                      <Chip
                        label={user?.role || 'Admin'}
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          borderRadius: 2
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Quick Stats */}
                    <Box sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          Member since: {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      

                    
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Profile Details Form */}
            <Grid size={{xs:12,md:8}}>
              <Fade in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    position: 'relative',
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
                  {/* Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      }}
                    >
                      Personal Information
                    </Typography>
                  </Box>

                  {/* Display Fields */}
                  <Grid container spacing={3}>
                    <Grid size={{xs:12,sm:6}}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={user?.full_name || user?.name || 'User'}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <BadgeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.grey[100], 0.5)
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{xs:12,sm:6}}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.grey[100], 0.5)
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{xs:12,sm:6}}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={user?.phone || ''}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.grey[100], 0.5)
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{xs:12}}>
                      <TextField
                        fullWidth
                        label="Role"
                        value={user?.role || 'Admin'}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.grey[100], 0.5)
                          }
                        }}
                        helperText="Role cannot be changed. Contact administrator for role modifications."
                      />
                    </Grid>
                  </Grid>

                 
                </Paper>
              </Fade>
            </Grid>
          </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
