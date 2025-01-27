import sequelize from "../db/dbconection.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const CauseFile = models.causeFile;

export default class causeFileService {
  async getAll(cause) {
    return await CauseFile.findAll({
      where: { causeId: cause },
      raw: true,
    });
  }

  async uploadFile(data) {
    const causeFile = {
      causeId: data.cause.id,
      file: data.file.path,
      isActive: 1,
      originalName: data.file.originalname,
    };
    return await CauseFile.create(causeFile);
  }

  async uploadMany(data) {
    data.files.forEach(async (file) => {
      const causeFile = {
        causeId: data.causeId,
        file: file.path,
        originalName: file.originalname,
        isActive: 1,
      };
      await CauseFile.create(causeFile);
    });
    return "Files added correctly";
  }

  async getFileNamesFromCause(causeId) {
    return await CauseFile.findAll({
      where: { causeId },
      raw: true,
    });
  }

  async getFileFromCause(causeId) {
    const files = await CauseFile.findAll({
      where: { causeId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(causeFileId) {
    const [causeFile] = await ComponentFile.findAll({
      where: { id: causeFileId },
      raw: true,
    });
    causeFile.data = await fileToBase64(causeFile);
    return causeFile;
  }

  // delete cause file by id
  async deleteCauseFile(causeFileId) {
    return await CauseFile.update(
      { isActive: 0 },
      {
        where: { id: causeFileId },
        raw: true,
      }
    );
  }

  async deleteCauseFile(causeFileId) {
    return await CauseFile.update(
      { isActive: 0 },
      {
        where: { id: causeFileId },
        raw: true,
      }
    );
  }
  async deleteCauseFileByCause(causeId) {
    return await CauseFile.update(
      { isActive: 0 },
      {
        where: { causeId: causeId },
        raw: true,
      }
    );
  }
}
