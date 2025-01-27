import axios from "../api/axiosAPI";

const areaURL = "area";
let axiosAPI = axios();

export const getAllAreas = async () => {
  const { data, error } = await axiosAPI.get(`${areaURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllAreasByPlant = async (plantId) => {
  const { data, error } = await axiosAPI.get(`${areaURL}/getAll/${plantId}`);
  if (error) {
    throw error;
  }

  return data.items;
};
