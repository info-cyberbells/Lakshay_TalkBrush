import axios from "axios";
import authRoutes from "./authRoutes";

//Login
const login = async (userData) => {
  const response = await axios.post(authRoutes.LOGIN, userData, {
    withCredentials: true, 
  });
  return response.data;
};

const verify = async () => {
  const response = await axios.get(authRoutes.VERIFY, {
    withCredentials: true,
  });
  return response.data;
};

const logout = async () => {
  const response = await axios.post(authRoutes.LOGOUT, {}, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  login,
  verify,
  logout,
};
