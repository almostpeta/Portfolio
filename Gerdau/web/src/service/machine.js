import { Files } from "react-bootstrap-icons";
import axios from "../api/axiosAPI";

let axiosAPI = axios();
const machineURL = "machine";
const faultURL = "fault";

export const createNewMachine = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "files") {
      data[key].forEach((element, i) => {
        console.log("files Machine", element);
        formData.append(key, element);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  console.log(formData, formData.getAll("files"));

  const { data: machineData, error } = await axiosAPI.post(
    `${machineURL}/create`,
    formData
  );
  if (error) {
    throw error;
  }

  return machineData.items;
};

export const editMachine = async (data, machineId) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "files") {
      data[key].forEach((element, i) => {
        formData.append(key, element);
      });
    }
    if (key === "deleteFiles") {
      data[key].forEach((element, i) => {
        formData.append(key + "[]", element);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  return await axiosAPI.put(`${machineURL}/update/${machineId}`, formData);
};

export const getAllMachines = async () => {
  const { data, error } = await axiosAPI.get(`${machineURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllMachineEvents = async (
  machineId,
  type,
  order,
  startDate,
  endDate
) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/getFaultAndTaskByDate`,
    {
      params: { machineId, order, type, startDate, endDate },
    }
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getMachineById = async (id) => {
  const { data, status, error } = await axiosAPI.get(
    `${machineURL}/getOne/id/${id}`
  );

  if (status === 200) {
    console.log(" machine service data", data.items);
    return data.items;
  }

  throw error;
};

export const deleteMachine = async (id) => {
  const { data, status, error } = await axiosAPI.delete(
    `${machineURL}/delete/${id}`
  );
  if (status !== 200) {
    throw error;
  }
};

export const getFiles = async (files) => {
  const machineFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `machineFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      machineFiles.push(data.items);
    })
  );

  return machineFiles;
};
