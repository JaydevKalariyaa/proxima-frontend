import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import theme from './theme';
import { initializeAuth } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import SalesList from './pages/SalesList';
import CreateSale from './pages/CreateSale';
import ClientInfo from './pages/ClientInfo';
import ViewSale from './pages/ViewSale';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize auth state from localStorage on app start and every refresh
    console.log('App: Initializing auth on page load/refresh');
    
    // Small delay to ensure proper initialization order
    const initializeAuthState = () => {
      dispatch(initializeAuth());
    };
    
    // Run immediately
    initializeAuthState();
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute>
                <SalesList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-sale" 
            element={
              <ProtectedRoute>
                <CreateSale />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client-info" 
            element={
              <ProtectedRoute>
                <ClientInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/view-sale/:id" 
            element={
              <ProtectedRoute>
                <ViewSale />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;