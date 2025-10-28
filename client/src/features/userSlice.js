// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { loginService, verifyService, logoutService, signupService, updateProfileService, getAllusersByType, deleteUsersService, editUserDetails } from "../auth/authServices";

// const user = JSON.parse(localStorage.getItem("User"));

// const initialState = {
//     user: user || null,
//     allUsers: [],

//     pagination: {
//         currentPage: 1,
//         totalPages: 1,
//         totalUsers: 0,
//         limit: 20,
//         sortBy: 'createdAt',
//         sortOrder: 'desc'
//     },
    
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: "",
// }

// export const login = createAsyncThunk("auth/login",
//     async (userData, thunkAPI) => {
//         try {
//             return await loginService(userData);
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// export const verify = createAsyncThunk("auth/verify",
//     async (_, thunkAPI) => {
//         try {
//             return await verifyService();
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// export const logout = createAsyncThunk("auth/logout",
//     async () => {
//         return await logoutService();
//     }
// )

// export const signUp = createAsyncThunk("auth/signup",
//     async (userData, thunkAPI) => {
//         try {
//             return await signupService(userData);
//         }
//         catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// )

// export const updateProfile = createAsyncThunk("auth/updateProfile",
//     async (userData, thunkAPI) => {
//         try {
//             return await updateProfileService(userData);
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// )

// export const getAllUsersByType = createAsyncThunk("auth/getAllUsersByType",
//     async (params = {}, thunkAPI) => {
//         try {
//             const { page, limit, sortBy, sortOrder } = params;
//             return await getAllusersByType(2, page, limit, sortBy, sortOrder);
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// )

// export const getAllUsersByTypeThree = createAsyncThunk("auth/getAllUsersByTypeThree",
//     async (params = {}, thunkAPI) => {
//         try {
//             const { page, limit, sortBy, sortOrder } = params;
//             return await getAllusersByType(3, page, limit, sortBy, sortOrder);
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// )

// export const deleteUsers = createAsyncThunk(
//     "auth/deleteUsers",
//     async (ids, { rejectWithValue }) => {
//         try {
//             const data = await deleteUsersService(ids);
//             return data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

// export const updateUser = createAsyncThunk(
//   "users/updateUser",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await editUserDetails(id, data);
//       return response.user; // return updated user object
//     } catch (error) {
//       // Provide readable error message
//       const message = error.response?.data?.message || error.message || "Failed to update user";
//       return rejectWithValue(message);
//     }
//   }
// );

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         reset: (state) => {
//             state.isLoading = false;
//             state.isSuccess = false;
//             state.isError = false;
//             state.message = "";
//         },
//         setPaginationConfig: (state, action) => {
//             state.pagination = {
//                 ...state.pagination,
//                 ...action.payload
//             };
//         }
//     },

//     extraReducers: (builder) => {
//         builder
//             //Login user
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.user = action.payload.user;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = false;
//                 state.user = action.payload.user;
//             })

//             //verify user
//             .addCase(verify.fulfilled, (state, action) => {
//                 state.user = action.payload.user;
//             })

//             //Logout user
//             .addCase(logout.fulfilled, (state) => {
//                 state.user = null;
//             })

//             //Signup user
//             .addCase(signUp.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(signUp.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.user = action.payload.user;
//             })
//             .addCase(signUp.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(updateProfile.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(updateProfile.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.user = action.payload.user;
//             })
//             .addCase(updateProfile.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })

//             //get all users by type2
//             .addCase(getAllUsersByType.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getAllUsersByType.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.allUsers = action.payload.users || [];
//                 state.pagination = {
//                     currentPage: action.payload.currentPage,
//                     totalPages: action.payload.totalPages,
//                     totalUsers: action.payload.totalUsers,
//                     limit: state.pagination.limit,
//                     sortBy: state.pagination.sortBy,
//                     sortOrder: state.pagination.sortOrder
//                 };
//             })
//             .addCase(getAllUsersByType.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })

//             //get all users by type3
//             .addCase(getAllUsersByTypeThree.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getAllUsersByTypeThree.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.allUsers = action.payload.users || [];
//                 state.pagination = {
//                     currentPage: action.payload.currentPage,
//                     totalPages: action.payload.totalPages,
//                     totalUsers: action.payload.totalUsers,
//                     limit: state.pagination.limit,
//                     sortBy: state.pagination.sortBy,
//                     sortOrder: state.pagination.sortOrder
//                 };
//             })
//             .addCase(getAllUsersByTypeThree.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })

//             // delete users
//             .addCase(deleteUsers.pending, (state) => {
//                 state.isLoading = true;
//                 state.isError = null;
//                 state.successMessage = null;
//             })
//             .addCase(deleteUsers.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.successMessage = action.payload.message;
//             })
//             .addCase(deleteUsers.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = action.payload;
//             })
//             .addCase(updateUser.pending, (state) => {
//                 state.isLoading = true;
//                 state.isError = null;
//             })
//             .addCase(updateUser.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 // update the specific user in the allUsers array
//                 const index = state.allUsers.findIndex(
//                 (user) => user._id === action.payload.id
//                 );
//                 if (index !== -1) {
//                 state.allUsers[index] = action.payload;
//                 }
//             })
//             .addCase(updateUser.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = action.payload;
//             })

//     }
// })

// export const { reset, setPaginationConfig } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, verifyService, logoutService, signupService, updateProfileService, getAllusersByType, deleteUsersService, editUserDetails } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    allUsers: [],

    // SEPARATE PAGINATION FOR EACH USER TYPE
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

            //get all users by type2 - UPDATE TYPE2 PAGINATION
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

            //get all users by type3 - UPDATE TYPE3 PAGINATION
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
    }
})

export const { reset, setPaginationConfigType2, setPaginationConfigType3 } = authSlice.actions;
export default authSlice.reducer;