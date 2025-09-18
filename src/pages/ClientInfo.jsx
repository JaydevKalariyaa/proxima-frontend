import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';
import { validatePhoneNumber } from '../utils/calc';
import { useConfirmSaleandSaveClientInfoMutation, useCancelSaleMutation } from '../store/api/salesApi';

const ClientInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    arc_name: '',
    arc_phone: '',
    arc_address: '',
    review_scanner: ''
  });
  
  const [errors, setErrors] = useState({});
  const [saleData, setSaleData] = useState(null);
  
  // RTK Query mutation hooks
  const [confirmSale, { isLoading: loading }] = useConfirmSaleandSaveClientInfoMutation();
  const [cancelSale, { isLoading: cancelLoading }] = useCancelSaleMutation();

  useEffect(() => {
    // Get sale data from navigation state
    const passedData = location.state?.saleData;
    if (passedData) {
      setSaleData(passedData);
    } else {
      // If no sale data, redirect back to create sale
      navigate('/create-sale');
    }
  }, [location.state, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Client phone is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Client address is required';
    }
    
    if (formData.arc_phone && !validatePhoneNumber(formData.arc_phone)) {
      newErrors.arc_phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create client data object in the required format
      const clientInfo = {
        client: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        },
        architect: {
          name: formData.arc_name || null,
          phone: formData.arc_phone || null,
          address: formData.arc_address || null
        },
        review_scanner: formData.review_scanner || null
      };
      
      // Call the API to confirm sale and save client info
      await confirmSale({
        saleId: saleData.id,
        clientInfo: clientInfo
      }).unwrap();
      
      // Show success message and redirect
      toast.success('Client information saved and sale confirmed successfully!');
      navigate('/sales');
      
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Error saving client information. Please try again.');
    }
  };

  const handleBack = async () => {
    try {
      // Call cancel sale API before redirecting
      await cancelSale(saleData.id).unwrap();
      
      // Show success message
      toast.success('Sale cancelled successfully');
      
      // Navigate back to create sale page
      navigate('/create-sale', { 
        state: { 
          clientData: formData,
          saleData: saleData 
        } 
      });
    } catch (error) {
      console.error('Error cancelling sale:', error);
      toast.error('Error cancelling sale. Please try again.');
    }
  };

  if (!saleData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        px: 3,
        py: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
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
        <Tooltip title="Back to Create Sale" arrow>
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
            Client Information
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        backgroundColor: alpha(theme.palette.primary.main, 0.01)
      }}>
        <Box sx={{ width: '100%', p: 3 }}>
          <Fade in={true} timeout={300}>
            <Box>
              {/* Client and Architect Information - Side by Side on Large Screens */}
              <Grid container spacing={4} sx={{ mb: 3 }}>
                {/* Client Information Section */}
                <Grid size={{xs:12,lg:6}}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <PersonIcon sx={{ color: theme.palette.primary.main }} />
                    Client Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        fullWidth
                        label="Client Name *"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        fullWidth
                        label="Client Phone *"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        placeholder="9876543210"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{xs:12}}>
                      <TextField
                        fullWidth
                        label="Client Address *"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        error={!!errors.address}
                        helperText={errors.address}
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Architect/Mistry Information Section */}
                <Grid size={{xs:12,lg:6}}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <ArchitectureIcon sx={{ color: theme.palette.primary.main }} />
                    Architect/Mistry Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        fullWidth
                        label="Architect/Mistry Name"
                        value={formData.arc_name}
                        onChange={(e) => handleChange('arc_name', e.target.value)}
                        placeholder="Optional"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        fullWidth
                        label="Architect/Mistry Phone"
                        value={formData.arc_phone}
                        onChange={(e) => handleChange('arc_phone', e.target.value)}
                        error={!!errors.arc_phone}
                        helperText={errors.arc_phone}
                        placeholder="9876543210"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{xs:12}}>
                      <TextField
                        fullWidth
                        label="Architect/Mistry Location"
                        value={formData.arc_address}
                        onChange={(e) => handleChange('arc_address', e.target.value)}
                        placeholder="Optional"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ 
                my: 3,
                '&::before, &::after': {
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }
              }} />

              {/* Review Scanner Section */}
              <Typography variant="h6" sx={{ 
                mb: 2, 
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LocationIcon sx={{ color: theme.palette.primary.main }} />
                Review & Scanner
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Review Scanner Notes"
                    value={formData.review_scanner}
                    onChange={(e) => handleChange('review_scanner', e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Add any additional notes, reviews, or scanner information..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Box 
        sx={{ 
          py: 2,
          px: 3,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          size="small"
          disabled={loading || cancelLoading}
          startIcon={cancelLoading ? <CircularProgress size={16} /> : null}
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.grey[300],
          }}
        >
          {cancelLoading ? 'Cancelling...' : 'Back'}
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={loading || cancelLoading}
          size="small"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          {loading ? 'Saving...' : 'Save Client'}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientInfo;