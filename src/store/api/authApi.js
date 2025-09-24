import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
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
