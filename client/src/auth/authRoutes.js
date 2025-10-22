export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
  LOGIN_USER: `${API_BASE_URL}/users/login`,
  VERIFY_USER: `${API_BASE_URL}/users/verifyToken`,
  LOGOUT_USER: `${API_BASE_URL}/users/logout`,
  SIGNUP_USER: `${API_BASE_URL}/users/signup`,
  UPDATEPROFILE_USER: `${API_BASE_URL}/users/updateProfile`,
  GETALLUSERS: `${API_BASE_URL}/users/getAllUsersByType`,
};


export default USER_ENDPOINTS;