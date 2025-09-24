import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';
const API_URL = import.meta.env.VITE_API_BASE_URL;
// Custom base query that handles 401 responses
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
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
