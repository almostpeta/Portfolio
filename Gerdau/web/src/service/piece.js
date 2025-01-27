import configs from "../config/configs";
import axios from "../api/axiosAPI";

let axiosAPI = axios();
const pieceURL = "piece";
const faultURL = "fault";

export const getAllPieces = async () => {
  const { data, error } = await axiosAPI.get(`${pieceURL}/getAll`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getPieceById = async (pieceId) => {
  const { data, error } = await axiosAPI.get(
    `${pieceURL}/getOne/id/${pieceId}`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllPieceEvents = async (
  pieceId,
  type,
  order,
  startDate,
  endDate
) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/getFaultAndTaskByDate`,
    {
      params: { pieceId, order, type, startDate, endDate },
    }
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const createNewPieces = async (data) => {
  const piecesList = [];
  data.forEach(async (piece, index) => {
    const formData = new FormData();
    Object.keys(piece).forEach((key) => {
      console.log("PIECE DATA", piece);
      if (key === "files") {
        piece[key].forEach((element, i) => {
          console.log("files PIECE", element);
          formData.append(key, element);
        });
      } else {
        formData.append(key, piece[key]);
      }
    });
    const pie = await axiosAPI.post(`${pieceURL}/create`, formData);
    piecesList.push(pie);
  });
  return piecesList;
};

export const getPiecesByComponentId = async (id) => {
  const { data, error } = await axiosAPI.get(`${pieceURL}/getAll/${id}`);
  if (error) {
    throw error;
  }
  return data.items;
};

export const editPieces = async (data) => {
  let piecesData = [];
  data.forEach(async (piece) => {
    const formData = new FormData();
    Object.keys(piece).forEach((key) => {
      if (key === "files") {
        piece[key] &&
          piece[key].forEach((element, i) => {
            formData.append(key, element);
          });
      }
      if (key === "deleteFiles") {
        piece[key] &&
          piece[key].forEach((element, i) => {
            formData.append(key, element);
          });
      } else {
        piece[key] && formData.append(key, piece[key]);
      }
    });
    const pieceData = await axiosAPI.put(`${pieceURL}/update `, formData);
    piecesData.push(pieceData);
  });

  return piecesData;
};

export const deletePieceById = async (id) => {
  const { data, error } = await axiosAPI.delete(`${pieceURL}/delete/${id}`);
  if (error) {
    throw error;
  }

  console.log("DATA", data.items);
  return data.items;
};

export const getFiles = async (files) => {
  const pieceFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `pieceFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      pieceFiles.push(data.items);
    })
  );

  return pieceFiles;
};
