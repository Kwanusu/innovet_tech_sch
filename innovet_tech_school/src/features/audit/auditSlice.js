import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchLogs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('http://localhost:8000/api/logs/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState: { logs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => { state.loading = true; })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default auditSlice.reducer;