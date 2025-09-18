import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { salesApi } from './api/salesApi';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [salesApi.reducerPath]: salesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, salesApi.middleware),
});

// TypeScript types would go here if using TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
