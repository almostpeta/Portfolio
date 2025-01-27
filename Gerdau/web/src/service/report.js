import axios from "../api/axiosAPI";
import moment from "moment";

let axiosAPI = axios();
const reportURL = "report";

export const tasksPerMonth = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/taskPerMonth`, {
    params: { year: moment().year() },
  });
  if (error) {
    throw error;
  }
  return data.items;
};

export const tasksPerMachine = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/taskPerMachine`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const faultsPerMonth = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsPerMonth`, {
    params: { year: moment().year() },
  });
  if (error) {
    throw error;
  }

  return data.items;
};

export const machinesTotalNumber = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/machineQuantity`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const faultsByType = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsByType`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const faultsByMachine = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsByMachine`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const pendingFaults = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsPending`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const faultsTotalNumbers = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsQuantity`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const tasksTotalNumbers = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/tasksQuantity`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const faultsNumbersByPeriod = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/faultsDaysQuantity`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const tasksNumbersByPeriod = async () => {
  const { data, error } = await axiosAPI.get(`${reportURL}/tasksDaysQuantity`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const generateCSV = async (type) => {
  const { data, error } = await axiosAPI.get(`${reportURL}/tableAsCsv`, {
    params: { table: type },
  });
  if (error) {
    throw error;
  }
  return data;
};
