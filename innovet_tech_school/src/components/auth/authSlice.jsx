import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig.js';

// --- Thunks ---

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/api/auth/me/');    
        return response.data; 
    } catch (err) {
        localStorage.removeItem('token');
        return rejectWithValue(err.response?.data || "Session expired");
    }
});

// Login Thunk
export const login = createAsyncThunk('/auth/login', async (credentials, {rejectWithValue}) => {
    try {
        const response = await API.post('/api/auth/login/', credentials);
        
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed");
    }
});
// Register Thunk
export const register = createAsyncThunk('/auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await API.post('/api/auth/register/', userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Registration failed');
    }
});

// --- Slice ---

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user:  null,
        isAuthenticated: false,
        status: 'idle', 
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'idle';
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(loadUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
            });
    }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
