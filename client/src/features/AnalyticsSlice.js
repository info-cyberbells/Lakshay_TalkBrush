import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../auth/authServices';

// Async thunk for fetching analytics data using the service
export const fetchAnalyticsData = createAsyncThunk(
    'analytics/fetchData',
    async (period = 'week', { rejectWithValue }) => {
        try {
            const data = await analyticsService.getType3Analytics(period);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        data: [],
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        period: 'week',
        loading: false,
        error: null,
        lastFetch: null
    },
    reducers: {
        setPeriod: (state, action) => {
            state.period = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAnalytics: (state) => {
            state.data = [];
            state.totalUsers = 0;
            state.activeUsers = 0;
            state.inactiveUsers = 0;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data || [];
                state.totalUsers = action.payload.totalUsers || 0;
                state.activeUsers = action.payload.activeUsers || 0;
                state.inactiveUsers = action.payload.inactiveUsers || 0;
                state.missingLoginUsers = action.payload.missingLoginUsers || 0;
                state.period = action.payload.period || state.period;
                state.lastFetch = new Date().toISOString();
            })
            .addCase(fetchAnalyticsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch analytics data';
            });
    }
});

export const { setPeriod, clearError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;