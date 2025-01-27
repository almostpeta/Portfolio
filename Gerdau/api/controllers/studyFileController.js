import sequelize from "../db/dbconection.js";
import studyService from "./studyController.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const StudyFile = models.studyFile;
const StudyService = new studyService();

export default class studyFileService {
  async getAll(study) {
    return await StudyFile.findAll({ where: { studyId: study }, raw: true });
  }

  async uploadFile(data) {
    const study = await StudyService.getOneStudy(data.studyId);
    const studyFile = {
      studyId: study.id,
      file: data.file,
      isActive: 1,
      originalName: data.file.originalname,
    };
    return await StudyFile.create(studyFile);
  }

  async uploadMany(data) {
    data.files.forEach(async (file) => {
      console.log(file);
      let studyFile = {
        studyId: data.studyId,
        file: file.path,
        isActive: 1,
        originalName: file.originalname,
      };
      await StudyFile.create(studyFile);
    });
    return "Files added correctly";
  }
  async getFileNamesFromStudy(studyId) {
    return await StudyFile.findAll({
      where: { studyId },
      raw: true,
    });
  }

  async getFileFromId(studyFileId) {
    const [studyFile] = await StudyFile.findAll({
      where: { id: studyFileId },
      raw: true,
    });
    studyFile.data = await fileToBase64(studyFile);
    return studyFile;
  }

  async getFileFromStudy(studyId) {
    const files = await StudyFile.findAll({
      where: { studyId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  // delete study file by id
  async deleteStudyFile(studyFileId) {
    return await StudyFile.update(
      { isActive: 0 },
      {
        where: { id: studyFileId },
        raw: true,
      }
    );
  }
}
