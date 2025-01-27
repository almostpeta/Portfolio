import axios from "../api/axiosAPI";

let axiosAPI = axios();
const searchURL = "search";

export const getFilteredValues = async (filterBy, value) => {
  const { data, error } = await axiosAPI.get(
    `${searchURL}?filterBy=${filterBy}&value=${value}`
  );
  if (error) {
    throw error;
  }

  return data.items;
};
