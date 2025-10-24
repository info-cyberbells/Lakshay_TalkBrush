import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, verifyService, logoutService, signupService, updateProfileService, getAllusersByType, deleteUsersService } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    allUsers: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },
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
    async (params = {}, thunkAPI) => {
        try {
            const { page, limit, sortBy, sortOrder } = params;
            return await getAllusersByType(2, page, limit, sortBy, sortOrder);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getAllUsersByTypeThree = createAsyncThunk("auth/getAllUsersByTypeThree",
    async (params = {}, thunkAPI) => {
        try {
            const { page, limit, sortBy, sortOrder } = params;
            return await getAllusersByType(3, page, limit, sortBy, sortOrder);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteUsers = createAsyncThunk(
    "auth/deleteUsers",
    async (ids, { rejectWithValue }) => {
        try {
            const data = await deleteUsersService(ids);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


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
        setPaginationConfig: (state, action) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload
            };
        }
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
                state.allUsers = action.payload.users || [];
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalUsers: action.payload.totalUsers,
                    limit: state.pagination.limit,
                    sortBy: state.pagination.sortBy,
                    sortOrder: state.pagination.sortOrder
                };
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
                state.allUsers = action.payload.users || [];
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalUsers: action.payload.totalUsers,
                    limit: state.pagination.limit,
                    sortBy: state.pagination.sortBy,
                    sortOrder: state.pagination.sortOrder
                };
            })
            .addCase(getAllUsersByTypeThree.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // delete users
            .addCase(deleteUsers.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
                state.successMessage = null;
            })
            .addCase(deleteUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            });

    }
})

export const { reset, setPaginationConfig } = authSlice.actions;
export default authSlice.reducer;
