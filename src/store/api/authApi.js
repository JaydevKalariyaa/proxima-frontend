import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://52d0436dfa6b.ngrok-free.app/api',
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'accounts/login/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
        body: { email, password }
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['Auth'],
    }),
    getCurrentUser: builder.query({
      query: () => 'me',
      providesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } = authApi;
