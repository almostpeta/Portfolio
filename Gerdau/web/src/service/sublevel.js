import axios from "../api/axiosAPI";

const sublevelURL = "sublevel";
let axiosAPI = axios();

export const getAllSublevels = async () => {
  const { data, error } = await axiosAPI.get(`${sublevelURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllSublevelsByArea = async (areaId) => {
  const { data, error } = await axiosAPI.get(`${sublevelURL}/getAll/${areaId}`);
  if (error) {
    throw error;
  }
  console.log("SUB ITEMS", data.items);
  return data.items;
};
