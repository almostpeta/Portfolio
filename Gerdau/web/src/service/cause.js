import axios from "../api/axiosAPI";
import { CAUSE_STATUSES } from "utils/constants";

let axiosAPI = axios();
const causeURL = "cause";

export const getAllCauses = async () => {
  const { data, error } = await axiosAPI.get(`${causeURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getApprovedCauses = async () => {
  const { data, error } = await axiosAPI.get(`${causeURL}/getCausesByStatus`, {
    params: { status: CAUSE_STATUSES.APPROVED },
  });
  if (error) {
    throw error;
  }

  return data.items;
};

export const getApprovedOrRequestedCauses = async () => {
  const { data, error } = await axiosAPI.get(`${causeURL}/getCausesByStatus`, {
    params: {
      status: JSON.stringify([
        CAUSE_STATUSES.APPROVED,
        CAUSE_STATUSES.REQUESTED,
      ]),
    },
  });
  if (error) {
    throw error;
  }

  return data.items;
};

export const createNewCause = async (causeData) => {
  const formData = new FormData();

  Object.keys(causeData).forEach((key) => {
    !!causeData[key] && formData.append(key, causeData[key]);
  });

  const { error, data } = await axiosAPI.post(`${causeURL}/create`, formData);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getCauseById = async (causeId) => {
  const { data, error } = await axiosAPI.get(`${causeURL}/getOne/${causeId}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const deleteCause = async (id) => {
  const { data, error } = await axiosAPI.delete(`${causeURL}/delete/${id}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const editCause = async (causeData, causeId) => {
  const formData = new FormData();
  Object.keys(causeData).forEach((key) =>
    formData.append(key, causeData[key] || "")
  );

  const { data, error } = await axiosAPI.put(
    `${causeURL}/update/${causeId}`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const changeCauseStatus = async (causeData, causeId) => {
  const formData = new FormData();
  Object.keys(causeData).forEach((key) =>
    formData.append(key, causeData[key] || "")
  );

  const { data, error } = await axiosAPI.put(
    `${causeURL}/status/${causeId}`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const getSimilarCauses = async (causeIds) => {
  const urlParams = new URLSearchParams();
  causeIds.map((id) => urlParams.append("causeIds", id));
  const { data, error } = await axiosAPI.get(
    `${causeURL}/similarCauses?${urlParams.toString()}`
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const resendCause = async (causeId) => {
  const { data, error } = await axiosAPI.put(
    `${causeURL}/resend/${causeId}`,
    {}
  );
  if (error) {
    throw error;
  }
  return data.items;
};
