import axiosAPI from "../api/axiosAPI";
import { setSession } from "../utils/session.js";

const authURL = "session";

export const logIn = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const { data, error } = await axiosAPI.post(`${authURL}`, formData);

  if (error) {
    let message = "";
    if (error === 401 || error.status === 401) {
      message = "Invalid email/password combination.";
    } else {
      message = "Something went wrong...";
    }

    throw new Error(message);
  }

  setSession(data.items);
  return data.items;
};
