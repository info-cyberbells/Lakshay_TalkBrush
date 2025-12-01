import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRoomService, joinRoomService, getRoomDetailsService } from "../auth/authServices";


export const createRoomThunk = createAsyncThunk(
    "room/createRoom",
    async (_, { rejectWithValue }) => {
        try {
            const result = await createRoomService();
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const joinRoomThunk = createAsyncThunk(
    "room/joinRoom",
    async (roomCode, { rejectWithValue }) => {
        try {
            const result = await joinRoomService(roomCode);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getRoomDetailsThunk = createAsyncThunk(
    "room/getRoomDetails",
    async (roomCode, { rejectWithValue }) => {
        try {
            const result = await getRoomDetailsService(roomCode);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const roomSlice = createSlice({
    name: "room",
    initialState: {
        room_code: null,
        loading: false,
        error: null,
        roomDetails: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            //create room and store room code in db
            .addCase(createRoomThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createRoomThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.room_code = action.payload.room_code;
            })

            .addCase(createRoomThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        //join existed room
        builder
            .addCase(joinRoomThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinRoomThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.room_code = action.payload.room_code;
            })
            .addCase(joinRoomThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET ROOM DETAILS
            .addCase(getRoomDetailsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getRoomDetailsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.roomDetails = action.payload;
            })

            .addCase(getRoomDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default roomSlice.reducer;
