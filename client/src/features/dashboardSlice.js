import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardService } from "../auth/authServices";

export const fetchDashboardData = createAsyncThunk(
    "dashboard/fetchDashboardData",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getDashboardService();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;