import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, verifyService, logoutService, signupService, updateProfileService, getProfileService, getAllusersByType, deleteUsersService, editUserDetails, changePasswordService, requestPasswordResetService, verifyResetCodeService } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    allUsers: [],

    paginationType2: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },
    paginationType3: {
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


//login thunk
export const login = createAsyncThunk("auth/login",
    async (userData, thunkAPI) => {
        try {
            return await loginService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


//verify thunk
export const verify = createAsyncThunk("auth/verify",
    async (_, thunkAPI) => {
        try {
            return await verifyService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


//logout thunk
export const logout = createAsyncThunk("auth/logout",
    async () => {
        return await logoutService();
    }
)


//signup thunk
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

//update profile thunk
export const updateProfile = createAsyncThunk("auth/updateProfile",
    async (userData, thunkAPI) => {
        try {
            return await updateProfileService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

//fetch login person data
export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, thunkAPI) => {
        try {
            return await getProfileService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//get all admin type 2
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

//get all users type 3
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

//delete users
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

//update users
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await editUserDetails(id, data);
            return response.user;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to update user";
            return rejectWithValue(message);
        }
    }
);

//change password
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await changePasswordService({ currentPassword, newPassword });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// request password reset (send OTP)
export const requestPasswordReset = createAsyncThunk(
    "auth/requestPasswordReset",
    async (email, { rejectWithValue }) => {
        try {
            const response = await requestPasswordResetService(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// verify reset code and set new password
export const verifyResetCode = createAsyncThunk(
    "auth/verifyResetCode",
    async ({ email, code, newPassword }, { rejectWithValue }) => {
        try {
            const response = await verifyResetCodeService({ email, code, newPassword });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
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
        // SEPARATE ACTIONS FOR EACH USER TYPE
        setPaginationConfigType2: (state, action) => {
            state.paginationType2 = {
                ...state.paginationType2,
                ...action.payload
            };
        },
        setPaginationConfigType3: (state, action) => {
            state.paginationType3 = {
                ...state.paginationType3,
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

            //update profile
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

            //get logged person detail builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
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
                state.paginationType2 = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalUsers: action.payload.totalUsers,
                    limit: state.paginationType2.limit,
                    sortBy: state.paginationType2.sortBy,
                    sortOrder: state.paginationType2.sortOrder
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
                state.paginationType3 = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalUsers: action.payload.totalUsers,
                    limit: state.paginationType3.limit,
                    sortBy: state.paginationType3.sortBy,
                    sortOrder: state.paginationType3.sortOrder
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
            })

            //update user 
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.allUsers.findIndex(
                    (user) => user._id === action.payload.id
                );
                if (index !== -1) {
                    state.allUsers[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            // change password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Password changed successfully!";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to change password.";
            })

            // request password reset
            .addCase(requestPasswordReset.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(requestPasswordReset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message || "OTP sent successfully!";
            })
            .addCase(requestPasswordReset.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to send OTP.";
            })

            // verify reset code
            .addCase(verifyResetCode.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(verifyResetCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message || "Password reset successful!";
            })
            .addCase(verifyResetCode.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Invalid or expired reset code.";
            })

    }
})

export const { reset, setPaginationConfigType2, setPaginationConfigType3 } = authSlice.actions;
export default authSlice.reducer;