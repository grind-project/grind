import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from '../features/documents/documentsSlice';
import authReducer from '../features/documents/authSlice';

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;