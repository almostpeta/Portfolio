import axios from "../api/axiosAPI";

const studyURL = "study";
let axiosAPI = axios();

export const getStudyById = async (studyId) => {
  const { data, error } = await axiosAPI.get(`${studyURL}/getOne/${studyId}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllStudiesFromComponentId = async (componentId) => {
  const { data, error } = await axiosAPI.get(
    `${studyURL}/getAll/component/${componentId}`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getStudies = async () => {
  const { data, error } = await axiosAPI.get(`${studyURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllStudiesFromPieceId = async (pieceId) => {
  const { data, error } = await axiosAPI.get(
    `${studyURL}/getAll/piece/${pieceId}`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const createStudy = async (study) => {
  const formData = new FormData();

  Object.keys(study).forEach((key) => {
    if (key === "files") {
      study[key].forEach((element) => {
        formData.append(key, element);
      });
    } else {
      formData.append(key, study[key]);
    }
  });

  const { data, error } = await axiosAPI.post(`${studyURL}/create`, formData);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getFiles = async (files) => {
  const studyFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `studyFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      studyFiles.push(data.items);
    })
  );
  console.log(studyFiles);
  return studyFiles;
};

export const editStudy = async (data, studyId) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "studyFiles") {
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
  const studyData = await axiosAPI.put(
    `${studyURL}/update/${studyId}`,
    formData
  );

  return studyData;
};

export const deleteStudy = async (id) => {
  const { data, status, error } = await axiosAPI.delete(
    `${studyURL}/delete/${id}`
  );
  if (status !== 200) {
    throw error;
  }
};
