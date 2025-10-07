// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_URL.endsWith("/")
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_URL + "/";

const authRoutes = {
  LOGIN: `${BASE_URL}login`,
  VERIFY: `${BASE_URL}verify`,
  LOGOUT: `${BASE_URL}logout`,
};

export default authRoutes;