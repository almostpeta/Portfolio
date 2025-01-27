import axios from "../api/axiosAPI";

const taskURL = "task";
let axiosAPI = axios();

export const getAllTasks = async () => {
  const { data, error } = await axiosAPI.get(`${taskURL}/getAll`);
  if (error) {
    throw error;
  }
  return data.items;
};

export const getTasksByUser = async (value) => {
  const { data, error } = await axiosAPI.get(
    `${taskURL}/getTasksByUser/${value}`
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const getTaskById = async (taskId) => {
  const { data, error } = await axiosAPI.get(`${taskURL}/getOne/${taskId}`);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const createTask = async (taskData) => {
  const formData = new FormData();
  Object.keys(taskData).forEach((key) => {
    formData.append(key, taskData[key]);
  });
  const { data, error } = await axiosAPI.post(`${taskURL}/create`, formData);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const editTask = async (taskData) => {
  const formData = new FormData();
  Object.keys(taskData).forEach((key) => {
    key && formData.append(key, taskData[key] || null);
  });
  const { data, error } = await axiosAPI.put(
    `${taskURL}/update/${taskData.id}`,
    formData
  );
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const deleteTask = async (taskId) => {
  const { data, error } = await axiosAPI.delete(`${taskURL}/delete/${taskId}`);
  if (error) {
    throw new Error(error);
  }

  return data.items;
};

export const setTaskAsCompleted = async (taskId) => {
  const { data, error } = await axiosAPI.post(
    `${taskURL}/${taskId}/completeTask`
  );
  if (error) {
    throw new Error(error);
  }

  return data.items;
};
