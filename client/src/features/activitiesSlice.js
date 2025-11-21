import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivitiesService, getUSersActivitiesService } from '../auth/authServices';

export const fetchActivities = createAsyncThunk(
    'activities/fetchActivities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getActivitiesService();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
);

export const fetchUserActivities = createAsyncThunk(
    'activities/fetchUserActivities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUSersActivitiesService();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
);

const activitiesSlice = createSlice({
    name: 'activities',
    initialState: {
        notifications: [],
        activities: [],
        allActivities: [],
        loading: false,
        error: null,
        lastFetched: null,
    },
    reducers: {
        clearActivities: (state) => {
            state.notifications = [];
            state.activities = [];
            state.allActivities = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            //fetch all activities
            .addCase(fetchActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications || [];
                state.activities = action.payload.activities || [];
                state.allActivities = action.payload.all || [];
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //fetch all user activities
            .addCase(fetchUserActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = [];
                state.activities = Array.isArray(action.payload) ? action.payload : [];
                state.allActivities = Array.isArray(action.payload) ? action.payload : [];
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchUserActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;