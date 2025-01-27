import axios from "../api/axiosAPI";

const errorURL = "error";
let axiosAPI = axios();

export const reportError = async (body) => {
  const formData = new FormData();
  formData.append("error", JSON.stringify(body));
  const { data, error } = await axiosAPI.post(`${errorURL}`, formData);
  if (error) {
    throw error;
  }

  return data.items;
};
