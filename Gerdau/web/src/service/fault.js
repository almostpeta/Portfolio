import axios from "../api/axiosAPI";

const faultURL = "fault";

export const createNewFault = async (faultData) => {
  const formData = new FormData();

  Object.keys(faultData).forEach((key) => {
    if (Array.isArray(faultData[key])) {
      faultData[key].forEach((element, i) => {
        formData.append(key, element);
      });
    } else {
      !!faultData[key] && formData.append(key, faultData[key]);
    }
  });
  const { data, error } = await axiosAPI.post(`${faultURL}/create`, formData);

  if (error) {
    throw error;
  }
  return data.items;
};

export const editFault = async (faultData) => {
  const formData = new FormData();
  Object.keys(faultData).forEach((key) => {
    if (key === "files") {
      faultData[key].forEach((element, i) => {
        formData.append(key, element);
      });
    }
    if (key === "deleteFiles") {
      faultData[key].forEach((element, i) => {
        formData.append(key + "[]", element);
      });
    } else {
      faultData[key] && formData.append(key, faultData[key]);
    }
  });
  const { data, error } = await axiosAPI.put(
    `${faultURL}/update/${faultData.id}`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};

let axiosAPI = axios();
export const getAllFaults = async () => {
  const { data: faults, error } = await axiosAPI.get(`${faultURL}/getAll`);
  if (error) {
    throw error;
  }
  return faults.items;
};

export const getFaultById = async (faultId) => {
  const { data, error } = await axiosAPI.get(`${faultURL}/getOne/${faultId}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const deleteFault = async (id) => {
  const { data, error } = await axiosAPI.delete(`${faultURL}/delete/${id}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getFaultZip = async (faultId) => {
  const { data, error } = await axiosAPI.get(`${faultURL}/faultZip/${faultId}`);
  if (error) {
    throw error;
  }
  return data.items;
};

export const getFiles = async (files) => {
  const faultFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `faultFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      faultFiles.push(data.items);
    })
  );

  return faultFiles;
};

export const getSuggestedCauses = async (faultId) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/${faultId}/suggestedCauses`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const relateCausesToFault = async (
  faultId,
  { causesToAdd, causesToDelete }
) => {
  const formData = new FormData();

  const newCauseIds = causesToAdd.map((c) => c.id);
  const deletedCauseIds = causesToDelete.map((c) => c.id);
  formData.append("newCauseIds", JSON.stringify(newCauseIds));
  formData.append("deletedCauseIds", JSON.stringify(deletedCauseIds));

  const { data, error } = await axiosAPI.post(
    `${faultURL}/${faultId}/causes`,
    formData
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const associateCausesFromAssistant = async (faultId, causeIds) => {
  const urlParams = new URLSearchParams();
  causeIds.map((id) => urlParams.append("causeIds", id));
  const { data, error } = await axiosAPI.get(
    `${faultURL}/${faultId}/causes-assistant?${urlParams.toString()}`
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const getFaultSolutions = async (faultId) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/${faultId}/solutions`
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const associateMethods = async (faultId, methods) => {
  const formData = new FormData();

  formData.append("methods", JSON.stringify(methods));

  const { data, error } = await axiosAPI.post(
    `${faultURL}/${faultId}/methods`,
    formData
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const setResolved = async (faultId) => {
  const { data, error } = await axiosAPI.post(
    `${faultURL}/${faultId}/setResolved`,
    {}
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const getFaultsByCauses = async (causeIds) => {
  const urlParams = new URLSearchParams();
  causeIds.forEach((id) => urlParams.append("id", id));
  const { data, error } = await axiosAPI.get(
    `${faultURL}/faultsByCauses?${urlParams.toString()}`
  );
  if (error) {
    throw error;
  }
  return data.items;
};

export const getResolveFaultCauses = async (faultId) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/${faultId}/resolve-fault-causes`
  );
  if (error) {
    throw error;
  }
  return data.items;
};
