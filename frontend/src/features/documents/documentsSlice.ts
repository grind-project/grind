import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import { Document } from '../../types/Document';  // Importez l'interface unique

interface DocumentsState {
  items: Document[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DocumentsState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async () => {
    const response = await api.get('/api/documents/');
    return response.data;
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default documentsSlice.reducer;