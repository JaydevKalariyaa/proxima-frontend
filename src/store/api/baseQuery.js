import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

// Custom base query that handles 401 responses
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  })(args, api, extraOptions);

  // If we get a 401, dispatch logout action
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
