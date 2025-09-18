import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const salesApi = createApi({
  reducerPath: 'salesApi',
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
  tagTypes: ['Sales'],
  endpoints: (builder) => ({
    getAllSaleItems: builder.query({
      query: (params) => ({
        url: 'sales/',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        params: params,
      }),
      providesTags: ['Sales'],
    }),
    createSale: builder.mutation({
      query: (sale) => ({
        url: 'sales/',
        method: 'POST',
        body: sale,
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
      }),
    }),
    confirmSaleandSaveClientInfo: builder.mutation({
      query: ({saleId,clientInfo}) => ({
        url: `sales/${saleId}/confirm/`,
        method: 'POST',
        body: clientInfo,
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
      }),
    }),
    cancelSale: builder.mutation({
      query: (saleId) => ({
        url: `sales/${saleId}/cancel/`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
      }),
    }),
    getAllClients: builder.query({
      query: (params) => ({
        url: 'clients/',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          // "ngrok-skip-browser-warning": "69420"
        },
        params: params,
      }),
    }),
    getSaleItemsByClient: builder.query({
      query: (clientId) => ({
        url: 'sales/',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        params: { client_id: clientId },
      }),
      providesTags: ['Sales'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAllSaleItemsQuery, useCreateSaleMutation, useConfirmSaleandSaveClientInfoMutation, useCancelSaleMutation, useGetAllClientsQuery, useGetSaleItemsByClientQuery } = salesApi;
