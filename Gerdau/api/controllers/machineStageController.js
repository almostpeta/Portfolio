import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const MachineStage = models.machineStage;
const Stage = models.stage;
export default class MachineStageService {
  async getAllStages() {
    return await Stage.findAll({ raw: true });
  }

  async getMachineStages(machineId) {
    return await MachineStage.findAll({ where: { machineId }, raw: true });
  }
}
