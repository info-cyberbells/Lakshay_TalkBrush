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
  const response = await axios.put(USER_ENDPOINTS.UPDATEPROFILE_USER, userData,{
    withCredentials: true,
  });
  return response.data;
}