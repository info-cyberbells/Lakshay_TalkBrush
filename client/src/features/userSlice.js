import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authServices from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

export const login = createAsyncThunk("auth/login",
    async(userData, thunkAPI)=>{
        try {
            return await authServices.login(userData);
        } catch (error) {
            return  thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const verify = createAsyncThunk("auth/verify", 
    async(_, thunkAPI)=>{
        try {
            return await authServices.verify();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout",
    async() => {
        return await authServices.logout();
    }
)


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
            },
    },
    extraReducers: (builder)=> {
        builder
        .addCase(login.pending, (state)=>{
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.payload;
        })
        .addCase(verify.fulfilled, (state, action)=>{
            state.user = action.payload.user;
        })
        .addCase(logout.fulfilled, (state)=>{
            state.user = null;
        } )
    }
})

export const {reset} = authSlice.actions;
export default authSlice.reducer;
