import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to prevent premature redirects
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    initializeAuth: (state) => {
      console.log('initializeAuth: Starting auth initialization...');
      state.loading = true;
      
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      
      console.log('initializeAuth: Found in localStorage:', { 
        hasUser: !!savedUser, 
        hasToken: !!savedToken,
        userLength: savedUser?.length || 0,
        tokenLength: savedToken?.length || 0
      });
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          state.user = userData;
          state.token = savedToken;
          state.isAuthenticated = true;
          console.log('initializeAuth: Successfully restored auth state:', { 
            user: state.user, 
            tokenPreview: state.token.substring(0, 20) + '...', 
            isAuthenticated: state.isAuthenticated 
          });
        } catch (error) {
          // Clear invalid data
          console.error('initializeAuth: Error parsing saved user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          console.log('initializeAuth: Cleared invalid auth data');
        }
      } else {
        // Clear any partial data
        if (savedUser || savedToken) {
          console.log('initializeAuth: Partial auth data found, clearing...');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        console.log('initializeAuth: No valid auth data found, user not authenticated');
      }
      state.loading = false;
      console.log('initializeAuth: Auth initialization completed');
    },
  },
});

export const { setCredentials, logout, setLoading, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
