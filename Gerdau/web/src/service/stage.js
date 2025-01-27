import axios from "../api/axiosAPI";

const stageURL = "stage";
let axiosAPI = axios();

export const getAllStages = async () => {
  const { data, error } = await axiosAPI.get(`${stageURL}`);
  if (error) {
    throw error;
  }

  return data.items;
};
