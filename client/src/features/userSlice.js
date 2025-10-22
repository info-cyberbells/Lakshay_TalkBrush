import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, verifyService, logoutService, signupService, updateProfileService, getAllusersByType } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    allUsers: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

export const login = createAsyncThunk("auth/login",
    async (userData, thunkAPI) => {
        try {
            return await loginService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const verify = createAsyncThunk("auth/verify",
    async (_, thunkAPI) => {
        try {
            return await verifyService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout",
    async () => {
        return await logoutService();
    }
)

export const signUp = createAsyncThunk("auth/signup",
    async (userData, thunkAPI) => {
        try {
            return await signupService(userData);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const updateProfile = createAsyncThunk("auth/updateProfile",
    async (userData, thunkAPI) => {
        try {
            return await updateProfileService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getAllUsersByType = createAsyncThunk("auth/getAllUsersByType",
    async (_, thunkAPI) => {
        try {
            return await getAllusersByType(2);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)


export const getAllUsersByTypeThree = createAsyncThunk("auth/getAllUsersByTypeThree",
    async (_, thunkAPI) => {
        try {
            return await getAllusersByType(3);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //Login user
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.user = action.payload.user;
            })

            //verify user
            .addCase(verify.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })

            //Logout user
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })

            //Signup user
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            //get all users by type2
            .addCase(getAllUsersByType.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsersByType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = action.payload.users || action.payload;
            })
            .addCase(getAllUsersByType.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            //get all users by type3
            .addCase(getAllUsersByTypeThree.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsersByTypeThree.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = action.payload.users || action.payload;
            })
            .addCase(getAllUsersByTypeThree.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
