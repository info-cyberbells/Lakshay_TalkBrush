export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
  LOGIN_USER: `${API_BASE_URL}/users/login`,
  VERIFY_USER: `${API_BASE_URL}/users/verifyToken`,
  LOGOUT_USER: `${API_BASE_URL}/users/logout`,
  SIGNUP_USER: `${API_BASE_URL}/users/signup`,
  GET_LOGGED_USER_DETAIL: `${API_BASE_URL}/users/profile`,
  UPDATEPROFILE_USER: `${API_BASE_URL}/users/updateProfile`,
  GETALLUSERS: `${API_BASE_URL}/users/getAllUsersByType`,
  DELETE_USERS: `${API_BASE_URL}/users/deleteUsers`,
  EDIT_USER: `${API_BASE_URL}/users/editUser`,

  ADD_NEW_EVENT: `${API_BASE_URL}/event/addEvent`,
  GET_ALL_EVENTS: `${API_BASE_URL}/event/getAllEvents`,
  UPDATE_EVENT: `${API_BASE_URL}/event/updateEvent`,
  DELETE_EVENT: `${API_BASE_URL}/event/deleteEvent`,
};


export default USER_ENDPOINTS;