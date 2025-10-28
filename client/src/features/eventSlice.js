import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addEventService, getAllEventsService, updateEventService, deleteEventService } from "../auth/authServices";

//add new event thunk
export const addEvent = createAsyncThunk(
    "events/addEvent",
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await addEventService(eventData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//thunk to get all events
export const fetchAllEvents = createAsyncThunk(
    "events/fetchAll",
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await getAllEventsService(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//update event thunk 
export const updateEvent = createAsyncThunk(
    "events/updateEvent",
    async ({ eventId, eventData }, { rejectWithValue }) => {
        try {
            const response = await updateEventService(eventId, eventData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//delete event thunk
export const deleteEvent = createAsyncThunk(
    "events/deleteEvent",
    async (eventId, { rejectWithValue }) => {
        try {
            await deleteEventService(eventId);
            return eventId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const eventSlice = createSlice({
    name: "events",
    initialState: {
        todayEvents: [],
        events: [],
        currentPage: 1,
        totalPages: 1,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //add new event builder
            .addCase(addEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
            })
            .addCase(addEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get all events builder
            .addCase(fetchAllEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.todayEvents = action.payload.todayEvents || [];
                state.events = action.payload.events || [];
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update event builder
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                const todayIndex = state.todayEvents.findIndex(e => e._id === action.payload._id);
                if (todayIndex !== -1) {
                    state.todayEvents[todayIndex] = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //delete event builder
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter(e => e._id !== action.payload);
                state.todayEvents = state.todayEvents.filter(e => e._id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default eventSlice.reducer;
