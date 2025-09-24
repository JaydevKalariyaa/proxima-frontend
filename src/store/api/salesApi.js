import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const salesApi = createApi({
  reducerPath: 'salesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Sales'],
  endpoints: (builder) => ({
    getAllSaleItems: builder.query({
      query: (params) => ({
        url: 'sales/',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          // "ngrok-skip-browser-warning": "69420"
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
          // "ngrok-skip-browser-warning": "69420"
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
          // "ngrok-skip-browser-warning": "69420"
        },
      }),
      invalidatesTags: ['Sales'],
    }),
    cancelSale: builder.mutation({
      query: (saleId) => ({
        url: `sales/${saleId}/cancel/`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          // "ngrok-skip-browser-warning": "69420"
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
      providesTags: ['Sales'],
    }),
    getSaleItemsByClient: builder.query({
      query: (clientId) => ({
        url: 'sales/',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          // "ngrok-skip-browser-warning": "69420"
        },
        params: { client_id: clientId },
      }),
      providesTags: ['Sales'],
    }),
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `clients/${clientId}/`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
      invalidatesTags: ['Sales'], // So client list refreshes after delete
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAllSaleItemsQuery, useCreateSaleMutation, useConfirmSaleandSaveClientInfoMutation, useCancelSaleMutation, useGetAllClientsQuery, useGetSaleItemsByClientQuery, useDeleteClientMutation } = salesApi;
