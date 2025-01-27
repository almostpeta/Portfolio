import axios from "../api/axiosAPI";

const userURL = "user";
const getAll = "getAll";
let axiosAPI = axios();

export const getAllUsers = async () => {
  const { data, error } = await axiosAPI.get(`${userURL}/${getAll}`);
  if (error) {
    throw error;
  }
  return data.items;
};

export const register = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    formData.append(key, userData[key]);
  });
  const { data, error } = await axiosAPI.post(`${userURL}/register`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const forgetPassword = async (userData) => {
  const formData = new FormData();
  formData.append("email", userData.email);
  const { data, error } = await axiosAPI.post(`passwordToken/create`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const resetPassword = async (userData) => {
  const formData = new FormData();
  formData.append("password", userData.password);
  formData.append("token", userData.token);
  const { data, error } = await axiosAPI.post(`user/changePassword`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const disableUser = async (userData) => {
  const formData = new FormData();
  formData.append("userId", userData.id);
  const { data, error } = await axiosAPI.post(`user/disableUser`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const enableUser = async (userData) => {
  const formData = new FormData();
  formData.append("userId", userData.id);
  const { data, error } = await axiosAPI.post(`user/enableUser`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const getUserById = async (id) => {
  const { data, error } = await axiosAPI.get(`user/getOne/id/${id}`);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const editUser = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    formData.append(key, userData[key]);
  });
  const { data, error } = await axiosAPI.put(
    `${userURL}/update/${userData.id}`,
    formData
  );
  if (error) {
    throw new Error(error);
  }

  return data.items;
};
