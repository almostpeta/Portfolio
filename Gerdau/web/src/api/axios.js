import axios from "axios";
import configs from "../config/configs";

const instance = axios.create({
  baseURL: `${configs.apiUrl}/api/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => ({ error: error.response?.data || error })
);

export default instance;
