import axios from "./axios";
import configs from "../config/configs";
import { getToken, deleteCurrentUser, deleteToken } from "lib/auth";
import moment from "moment";

const unauthorizedRoutes = ["/login", "/forget", "/reset", "/404"];

const apiCall = () => {
  const token = getToken();
  const currentTime = moment().add(1, "minute");
  if (moment(token?.expiresAt).isSameOrBefore(currentTime)) {
    deleteToken();
    deleteCurrentUser();
    if (!unauthorizedRoutes.includes(window.location.pathname)) {
      window.location.href = "/login";
    }
    return axios;
  }
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
    return axios;
  }
};

export default apiCall;
