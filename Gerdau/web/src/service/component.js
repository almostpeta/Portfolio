import axios from "../api/axiosAPI";

const componentURL = "component";
const faultURL = "fault";
let axiosAPI = axios();

export const getAllComponents = async () => {
  const { data, error } = await axiosAPI.get(`${componentURL}/getAll`);
  if (error) {
    throw error;
  }
  console.log("DATA COmponents", data.items);
  return data.items;
};

export const getAllComponentsByMachineId = async (id) => {
  const { data, error } = await axiosAPI.get(`${componentURL}/getAll/${id}`);
  if (error) {
    throw error;
  }

  return data.items;
};

export const getAllComponentEvents = async (
  componentId,
  type,
  order,
  startDate,
  endDate
) => {
  const { data, error } = await axiosAPI.get(
    `${faultURL}/getFaultAndTaskByDate`,
    {
      params: { componentId, order, type, startDate, endDate },
    }
  );
  if (error) {
    throw error;
  }

  return data.items;
};

export const createNewComponents = async (data) => {
  const componentsList = [];
  data.forEach(async (component, index) => {
    const formData = new FormData();
    Object.keys(component).forEach((key) => {
      console.log("COMPONENT DATA", component);
      if (key === "files") {
        component[key].forEach((element, i) => {
          console.log("files Component", element);
          formData.append(key, element);
        });
      } else {
        formData.append(key, component[key]);
      }
    });
    const compo = await axiosAPI.post(`${componentURL}/create`, formData);
    componentsList.push(compo);
  });
  return componentsList;
};

export const editComponents = async (data) => {
  let componentsData = [];
  data.forEach(async (component) => {
    const formData = new FormData();
    Object.keys(component).forEach((key) => {
      if (key === "files") {
        component[key].forEach((element, i) => {
          formData.append(key, element);
        });
      }
      if (key === "deleteFiles") {
        component[key].forEach((element, i) => {
          formData.append(key, element);
        });
      } else {
        formData.append(key, component[key]);
      }
    });
    const componentData = await axiosAPI.put(
      `${componentURL}/update`,

      formData
    );
    componentsData.push(componentData);
  });

  return componentsData;
};

export const getComponentById = async (id) => {
  const { data, error } = await axiosAPI.get(`${componentURL}/getOne/id/${id}`);
  if (error) {
    throw error;
  }
  console.log("DATA", data);
  return data.items;
};

export const deleteComponentById = async (id) => {
  const { data, error } = await axiosAPI.delete(`${componentURL}/delete/${id}`);
  if (error) {
    throw error;
  }
  console.log("DATA", data);
  return data.items;
};

export const getComponentFiles = async (id) => {
  const { data, error } = await axiosAPI.get(
    `componentFile/getFileNamesFromComponent/id/${id}`
  );
  if (error) {
    throw error;
  }

  console.log("DATA files", data);
  return data.items;
};

export const getFiles = async (files) => {
  const componentsFiles = [];
  await Promise.all(
    files.map(async (file, index) => {
      const { data, error } = await axiosAPI.get(
        `componentFile/getFileFromId/id/${file.id}`
      );
      if (error) {
        throw error;
      }
      componentsFiles.push(data.items);
    })
  );
  console.log(componentsFiles);
  return componentsFiles;
};
