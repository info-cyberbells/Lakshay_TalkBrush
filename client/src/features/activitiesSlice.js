import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivitiesService } from '../auth/authServices'; 

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
            });
    },
});

export const { clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;