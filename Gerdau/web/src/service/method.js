import axios from "../api/axiosAPI";

const methodURL = "method";
const axiosAPI = axios();

export const createMethod = async (methodData) => {
  const formData = new FormData();

  Object.keys(methodData).forEach((key) => {
    if (key === "files") {
      methodData[key].forEach((element) => {
        formData.append(key, element);
      });
    } else {
      formData.append(key, methodData[key]);
    }
  });

  const { data, error } = await axiosAPI.post(`${methodURL}/create`, formData);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getMethodById = async (methodId) => {
  const { data, error } = await axiosAPI.get(`${methodURL}/getOne/${methodId}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getFiles = async (files) => {
  const methodFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `methodFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      methodFiles.push(data.items);
    })
  );

  return methodFiles;
};

export const editMethod = async (methodData, methodId) => {
  const formData = new FormData();
  Object.keys(methodData).forEach((key) => {
    if (key === "files") {
      methodData[key].forEach((element, i) => {
        formData.append(key, element);
      });
    }
    if (key === "deleteFiles") {
      methodData[key].forEach((element, i) => {
        formData.append(key + "[]", element);
      });
    } else {
      formData.append(key, methodData[key]);
    }
  });
  const { data, error } = await axiosAPI.put(
    `${methodURL}/update/${methodId}`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};
