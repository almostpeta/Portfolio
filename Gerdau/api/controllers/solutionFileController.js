import sequelize from "../db/dbconection.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const SolutionFile = models.solutionFile;

export default class SolutionFileService {
  async uploadFile(data) {
    const solutionFile = {
      solutionId: data.body.solutionId,
      file: data.file.path,
      isActive: true,
    };
    return await SolutionFile.create(solutionFile);
  }

  async uploadMany(data) {
    data.files.forEach(async (file) => {
      let solutionFile = {
        solutionId: data.solutionId,
        file: file.path,
        originalName: file.originalname,
        relatedTo: "files",
        isActive: true,
      };
      await SolutionFile.create(solutionFile);
    });
    return "Files added correctly";
  }

  async getFileNamesFromSolution(solutionId) {
    return await SolutionFile.findAll({
      where: { solutionId },
      raw: true,
    });
  }
  async getFileFromSolution(id) {
    const files = await SolutionFile.findAll({
      where: { id },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(solutionFileId) {
    const [solutionFile] = await SolutionFile.findAll({
      where: { id: solutionFileId },
      raw: true,
    });
    solutionFile.data = await fileToBase64(solutionFile);
    return solutionFile;
  }

  // delete solution file by id
  async deleteSolutionFile(solutionFileId) {
    return await SolutionFile.update(
      { isActive: 0 },
      {
        where: { id: solutionFileId },
        raw: true,
      }
    );
  }

  // delete solution file by solution
  async deleteSolutionFileBySolution(solutionId) {
    return await SolutionFile.update(
      { isActive: 0 },
      {
        where: { solutionId: solutionId },
        raw: true,
      }
    );
  }
}
