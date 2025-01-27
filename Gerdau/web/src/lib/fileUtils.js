var b64toBlob = require("b64-to-blob");

export const selectFileMimeType = (type) => {
  let applicationType;
  switch (type) {
    case "image":
      applicationType = "image/png";
      break;
    case "pdf":
      applicationType = "application/pdf";
      break;
    case "docx":
      applicationType = " application/msword";
      break;
    case "xlsx":
      applicationType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    case "xlsx":
      applicationType = "text/csv";
      break;
    case "webm":
      applicationType = "audio/webm";
      break;
  }
  return applicationType;
};

export const selectFileType = (fileName) => {
  const ext = fileName && fileName.substr(fileName.lastIndexOf(".") + 1);
  const fileType =
    ["pdf", "csv", "docx", "xlsx", "webm"].indexOf(ext) !== -1
      ? ext
      : ["mkv", "mp4", "mov"].indexOf(ext) !== -1
      ? "video"
      : "image";
  return fileType;
};

export const getBlobContentBase64 = (file) => {
  let fileType = selectFileType(file.file);
  var contentType = selectFileMimeType(fileType);
  var blob = b64toBlob(file.data, contentType);
  return URL.createObjectURL(blob);
};

export const parseFiles = (files, identifier = "faultId") => {
  return files.map((file) => ({
    id: file.id,
    [identifier]: file[identifier],
    name: file.name || file.file,
    url: file.url || getBlobContentBase64(file),
    customType: file.customType || selectFileType(file.file),
  }));
};

export const parseAudio = (fault) => {
  const byteCharacters = atob(fault.data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "audio/mpeg" });
  const blobURL = URL.createObjectURL(blob);

  return {
    ...fault,
    blobURL,
  };
};

const getBase64Type = (type) => {
  switch (type) {
    case "pdf":
      return "application/pdf";
    case "mp4":
      return "video/mp4";
    default:
      return `image/${type}`;
  }
};

export const getFileFromBase64 = async (dataUrl, fileName) => {
  const extensionIndex = fileName.lastIndexOf(".");
  const fileType = fileName.substring(extensionIndex + 1);
  const baseType = getBase64Type(fileType);
  const res = await fetch(`data:${baseType};base64,` + dataUrl);
  const blob = await res.blob();
  const fileInstance = await new File([blob], fileName, {
    type: baseType,
  });
  return fileInstance;
};
