import machineService from "./machineController.js";
import sequelize from "../db/dbconection.js";
import { fileToBase64 } from "../utils/utils.js";

const models = sequelize.models;
const MachineFile = models.machineFile;

const MachineService = new machineService();

export default class machineFileService {
  async getAll(machine) {
    return await MachineFile.findAll({
      where: { machineId: machine },
      raw: true,
    });
  }

  async uploadFile(data) {
    const machine = await MachineService.getOneMachineOnly(data.machineId);
    const machineFile = {
      machineId: machine.id,
      file: data.file,
      isActive: 1,
    };
    return await MachineFile.create(machineFile);
  }

  async uploadMany(data) {
    data.files?.forEach(async (file) => {
      let machineFile = {
        machineId: data.machineId,
        file: file.path,
        originalName: file.originalname,
        isActive: 1,
      };
      await MachineFile.create(machineFile);
    });
    return "Files added correctly";
  }

  async getFileNamesFromMachine(machineId) {
    return await MachineFile.findAll({
      where: { machineId },
      raw: true,
    });
  }

  async getFileFromMachine(machineId) {
    const files = await MachineFile.findAll({
      where: { machineId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(machineFileId) {
    const [machineFile] = await MachineFile.findAll({
      where: { id: machineFileId },
      raw: true,
    });
    machineFile.data = await fileToBase64(machineFile);
    return machineFile;
  }

  // delete machine file by id
  async deleteMachineFile(machineFileId) {
    return await MachineFile.update(
      { isActive: 0 },
      {
        where: { id: machineFileId },
        raw: true,
      }
    );
  }

  // delete all studies by component
  async deleteAllFilesByMachines(machineId) {
    return await MachineFile.update(
      { isActive: 0 },
      { where: { machineId: machineId } }
    );
  }
}
