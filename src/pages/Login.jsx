import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { setCredentials } from '../store/slices/authSlice';
import { useLoginMutation } from '../store/api/authApi';
import { useEffect } from 'react';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
useEffect(() => {
  if (isAuthenticated) {
    navigate('/sales');
  }
}, [isAuthenticated, navigate]);
  

  // Show loading while checking auth state
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ 
        email: formData.email, 
        password: formData.password 
      }).unwrap();
      console.log(result);
      if (result.success) {
        // Extract user data and token from response

        dispatch(setCredentials({ user:result.data, token:result.access }));
        
        toast.success(result.message);
        navigate('/sales');
      } else {
        console.log(result);
        toast.error(result.message || 'Login failed');
        setError(result.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Proxima
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your premium furniture showroom management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Manage your furniture inventory, track sales, and serve customers with ease
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

