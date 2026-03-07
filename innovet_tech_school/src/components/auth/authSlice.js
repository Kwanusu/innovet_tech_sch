import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig.js';

// --- Thunks ---

/**
 * Load User: Fetches the profile for the current token.
 * This should be dispatched in your App.js useEffect if a token exists.
 */
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/api/auth/me/');    
        return response.data; 
    } catch (err) {
        // If the token is invalid or expired, clear it
        if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('token');
        }
        return rejectWithValue(err.response?.data || "Session expired");
    }
});

/**
 * Login: Authenticates and stores the access token.
 */
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await API.post('/api/auth/login/', credentials);
        
        // Ensure the token is stored immediately upon successful login
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
        } else if (response.data.token) {
            // Handle cases where the key might be 'token' instead of 'access'
            localStorage.setItem('token', response.data.token);
        }

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed");
    }
});

/**
 * Register: Creates a new account.
 */
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
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
        user: null,
        token: localStorage.getItem('token'),
        status: localStorage.getItem('token') ? 'loading' : 'idle',
        isAuthenticated: !!localStorage.getItem('token'), 
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Logic
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.token = localStorage.getItem('token');
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(loadUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = localStorage.getItem('token');
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            });
    }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;