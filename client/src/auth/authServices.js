import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";

//Login user
export const loginService = async (userData) => {
  const response = await axios.post(USER_ENDPOINTS.LOGIN_USER, userData, {
    withCredentials: true,
  });
  return response.data;
};

//Verify user
export const verifyService = async () => {
  const response = await axios.get(USER_ENDPOINTS.VERIFY_USER, {
    withCredentials: true,
  });
  return response.data;
};

//Logout User
export const logoutService = async () => {
  const response = await axios.post(USER_ENDPOINTS.LOGOUT_USER, {}, {
    withCredentials: true,
  });
  return response.data;
};

//signup user
export const signupService = async (userData) => {
  const response = await axios.post(USER_ENDPOINTS.SIGNUP_USER, userData, {
    withCredentials: true,
  });
  return response.data;
}

//update profile
export const updateProfileService = async (userData) => {
  const response = await axios.put(USER_ENDPOINTS.UPDATEPROFILE_USER, userData, {
    withCredentials: true,
  });
  return response.data;
}

export const getAllusersByType = async (type, page, limit, sortBy, sortOrder) => {
  const params = new URLSearchParams({ type });

  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const response = await axios.get(`${USER_ENDPOINTS.GETALLUSERS}?${params.toString()}`);
  return response.data;
}


export const deleteUsersService = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Please provide an array of user IDs");
  }

  const response = await axios.delete(USER_ENDPOINTS.DELETE_USERS, {
    data: { ids },
    withCredentials: true, 
  });

  return response.data;
};