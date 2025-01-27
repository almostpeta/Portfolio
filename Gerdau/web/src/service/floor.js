import axios from "../api/axiosAPI";
let axiosAPI = axios();
const floorURL = "plant";
const getAll = "getAll";

export const getAllFloors = async () => {
  const { data, error } = await axiosAPI.get(`${floorURL}/${getAll}`);
  if (error) {
    throw error;
  }

  return data.items;
};
