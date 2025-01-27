import axios from "../api/axiosAPI";
import { selectFileType, getBlobContentBase64 } from "lib/fileUtils";
import { SOLUTION_STATUSES } from "utils/constants";

const solutionURL = "solution";
const axiosAPI = axios();

export const getSolutionById = async (solutionId) => {
  const { data, error } = await axiosAPI.get(
    `${solutionURL}/getOne/${solutionId}`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllSolutions = async () => {
  const { data, error } = await axiosAPI.get(`${solutionURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getApprovedSolutions = async () => {
  const { data, error } = await axiosAPI.get(
    `${solutionURL}/getSolutionsByStatus`,
    {
      params: { status: SOLUTION_STATUSES.APPROVED },
    }
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const createSolution = async (solutionData) => {
  const formData = new FormData();

  Object.keys(solutionData).forEach((key) => {
    if (key === "files") {
      solutionData[key].forEach((element) => {
        formData.append(key, element);
      });
    } else {
      formData.append(key, solutionData[key]);
    }
  });

  const { data, error } = await axiosAPI.post(
    `${solutionURL}/create`,
    formData
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getFiles = async (files, parseFiles = true) => {
  const solutionFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `/solutionFile/getFileFromSolution/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      solutionFiles.push(...data.items);
    })
  );

  return parseFiles
    ? solutionFiles.map((file) => ({
        id: file.id,
        name: file.name || file.file,
        url: file.url || getBlobContentBase64(file),
        customType: file.customType || selectFileType(file.file),
        relatedTo: file.relatedTo,
      }))
    : solutionFiles;
};

export const editSolution = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "files" && data[key]) {
      data[key].forEach((element) => {
        element && formData.append("solutionFiles", element);
      });
      // } else if (key === "deleteFiles") {
      //   data[key].forEach((element) => {
      //     element && formData.append("deleteFiles", element);
      //   });
    } else if (typeof data[key] === "object") {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });
  console.log("alll", formData.getAll("deleteFile"));
  const solutionData = await axiosAPI.put(
    `${solutionURL}/update/${data.id}`,
    formData
  );

  return solutionData;
};

export const deleteSolution = async (id) => {
  const { data, status, error } = await axiosAPI.delete(
    `${solutionURL}/delete/${id}`
  );
  if (status !== 200) {
    throw error;
  }
};

export const changeStatus = async (solutionData) => {
  const formData = new FormData();
  Object.keys(solutionData).forEach((key) =>
    formData.append(key, solutionData[key] || "")
  );

  const { data, error } = await axiosAPI.put(
    `${solutionURL}/status/${solutionData.id}`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const resendSolution = async (solutionId) => {
  const { data, error } = await axiosAPI.put(
    `${solutionURL}/resend/${solutionId}`,
    {}
  );
  if (error) {
    throw error;
  }
  return data.items;
};
