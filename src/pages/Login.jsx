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
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { setCredentials } from "../store/slices/authSlice";
import { useLoginMutation } from "../store/api/authApi";
import { useEffect } from "react";
const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/sales");
    }
  }, [isAuthenticated, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      console.log(result);
      if (result.success) {
        // Extract user data and token from response

        dispatch(setCredentials({ user: result.data, token: result.access }));

        toast.success(result.message);
        navigate("/sales");
      } else {
        console.log(result);
        toast.error(result.message || "Login failed");
        setError(result.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        // minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          width: "100%",
          maxWidth: isMobile ? "100%" : 400,
          borderRadius: isMobile ? 2 : 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: isMobile ? 2 : 4 }}>
          <LoginIcon
            sx={{
              fontSize: isMobile ? 36 : 48,
              color: "primary.main",
              mb: isMobile ? 1 : 2,
            }}
          />
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Welcome to Proxima
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
          >
            Your premium furniture showroom management system
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: isMobile ? 2 : 3,
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
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
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
            }}
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
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size={isMobile ? "medium" : "large"}
            disabled={isLoading}
            sx={{
              mt: isMobile ? 2 : 3,
              mb: isMobile ? 1 : 2,
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? "0.875rem" : "1rem",
              fontWeight: 600,
              borderRadius: isMobile ? 2 : 3,
            }}
          >
            {isLoading ? (
              <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        <Box
          sx={{
            mt: isMobile ? 2 : 3,
            p: isMobile ? 1.5 : 2,
            bgcolor: "grey.50",
            borderRadius: isMobile ? 1 : 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Manage your furniture inventory, track selections, and serve customers
            with ease
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

