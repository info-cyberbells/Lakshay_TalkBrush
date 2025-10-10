export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
  LOGIN_USER: `${API_BASE_URL}/login`,
  VERIFY_USER: `${API_BASE_URL}/verifyToken`,
  LOGOUT_USER: `${API_BASE_URL}/logout`,
};


export default USER_ENDPOINTS;