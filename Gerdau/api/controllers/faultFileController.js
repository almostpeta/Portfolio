import sequelize from "../db/dbconection.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const FaultFile = models.faultFile;

export default class FaultFileService {
  async uploadFile(data) {
    const faultFile = {
      faultId: data.faultId,
      file: data.file.path,
      isActive: true,
    };
    return await FaultFile.create(faultFile);
  }

  async uploadMany(data) {
    data.files.forEach(async (file) => {
      let faultFile = {
        faultId: data.faultId,
        file: file.path,
        originalName: file.originalname,
        relatedTo: file.fieldname,
        isActive: true,
      };
      await FaultFile.create(faultFile);
    });
    return "Files added correctly";
  }
  async getFileNamesFromFault(faultId) {
    return await FaultFile.findAll({
      where: { faultId },
      raw: true,
    });
  }
  async getFileFromFault(faultId) {
    const files = await FaultFile.findAll({
      where: { faultId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(faultFileId) {
    const [faultFile] = await FaultFile.findAll({
      where: { id: faultFileId },
      raw: true,
    });
    faultFile.data = await fileToBase64(faultFile);
    return faultFile;
  }

  // delete machine file by id
  async deleteFaultFile(faultFileId) {
    return await FaultFile.update(
      { isActive: 0 },
      {
        where: { id: faultFileId },
        raw: true,
      }
    );
  }
}
