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
  CHANGE_PASSWORD: `${API_BASE_URL}/users/changePassword`,

  ADD_NEW_EVENT: `${API_BASE_URL}/event/addEvent`,
  GET_ALL_EVENTS: `${API_BASE_URL}/event/getAllEvents`,
  UPDATE_EVENT: `${API_BASE_URL}/event/updateEvent`,
  DELETE_EVENT: `${API_BASE_URL}/event/deleteEvent`,

  RESET_PASSWORD: `${API_BASE_URL}/users/resetPassword`,
  VERIFY_RESET_CODE: `${API_BASE_URL}/users/verifyResetCode`,


  ADMIN_DASHBOARD_OVERVIEW: `${API_BASE_URL}/dashboard/overview`,
  GET_TYPE3_ANALYTICS: `${API_BASE_URL}/analysis/type3`,


  GET_ALL_ACTIVITIES: `${API_BASE_URL}/activities/getAllActivities`,
  GET_ALL_USER_ACTIVITIES: `${API_BASE_URL}/activities/getUserActivities`,
};


export default USER_ENDPOINTS;