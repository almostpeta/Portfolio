import sequelize from "../db/dbconection.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const MethodFile = models.methodFile;

export default class MethodFileService {
  async uploadFile(data) {
    const methodFile = {
      methodId: data.body.methodId,
      file: data.file.path,
      isActive: true,
    };
    return await MethodFile.create(methodFile);
  }

  async uploadMany(data) {
    data.files.forEach(async (file) => {
      let methodFile = {
        methodId: data.methodId,
        file: file.path,
        originalName: file.originalname,
        relatedTo: file.fieldname,
        isActive: true,
      };
      await MethodFile.create(methodFile);
    });
    return "Files added correctly";
  }

  async getFileNamesFromMethod(methodId) {
    return await MethodFile.findAll({
      where: { methodId },
      raw: true,
    });
  }
  async getFileFromMethod(methodId) {
    const files = await MethodFile.findAll({
      where: { methodId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(methodFileId) {
    const [methodFile] = await MethodFile.findAll({
      where: { id: methodFileId },
      raw: true,
    });
    methodFile.data = await fileToBase64(methodFile);
    return methodFile;
  }

  // delete method file by id
  async deleteMethodFile(methodFileId) {
    return await MethodFile.update(
      { isActive: 0 },
      {
        where: { id: methodFileId },
        raw: true,
      }
    );
  }

  // delete method file by method
  async deleteMethodFileByMethod(methodId) {
    return await MethodFile.update(
      { isActive: 0 },
      {
        where: { methodId: methodId },
        raw: true,
      }
    );
  }
}
