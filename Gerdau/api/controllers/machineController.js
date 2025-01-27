import sequelize from "../db/dbconection.js";
import Sequelize from "sequelize";
import { withTransaction } from "../utils/utils";

const Op = Sequelize.Op;

const models = sequelize.models;
const Machine = models.machine;
const MachineStage = models.machineStage;
export default class machineService {
  // find all machines
  async getAllMachines(startDate, endDate) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    return await Machine.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] }, isActive: 1 },
      include: [
        {
          model: models.component,
          as: "components",
          include: [
            {
              model: models.piece,
              include: [
                {
                  model: models.user,
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.pieceFile },
              ],
            },
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            { model: models.fault },
            { model: models.componentFile },
          ],
        },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        { model: models.area },
        { model: models.plant },
        { model: models.sublevel },
        { model: models.machineFile },
        { model: models.task },
        { model: models.stage },
      ],
    });
  }

  // find one machine by id
  async getOneMachine(machineId) {
    return await Machine.findOne({
      where: { id: parseInt(machineId), isActive: 1 },
      include: [
        {
          model: models.component,
          as: "components",
          include: [
            {
              model: models.piece,
              include: [
                {
                  model: models.user,
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.pieceFile },
              ],
            },
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.fault,
              include: [
                { model: models.faultFile },
                {
                  model: models.user,
                  as: "responsible",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                {
                  model: models.user,
                  as: "reporters",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                {
                  model: models.cause,
                  as: "causes",
                  include: [
                    {
                      model: models.user,
                      as: "requested",
                      attributes: [
                        "id",
                        "name",
                        "firstName",
                        "lastName",
                        "email",
                        "role",
                        "isActive",
                      ],
                    },
                    { model: models.causeFile },
                  ],
                },
                { model: models.piece },
              ],
            },
            { model: models.componentFile },
          ],
        },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        { model: models.area },
        { model: models.plant },
        { model: models.sublevel },
        { model: models.machineFile },
        { model: models.task },
        { model: models.stage },
      ],
    });
  }

  async getOneMachineOnly(machineId) {
    return await Machine.findOne({
      where: { id: parseInt(machineId), isActive: 1 },
    });
  }

  // find one machine by internal name
  async getOneMachineByName(machineName) {
    return await Machine.findOne({
      where: { internal_name: machineName, isActive: 1 },
      include: [
        {
          model: models.component,
          as: "components",
          include: [
            {
              model: models.piece,
              include: [
                {
                  model: models.user,
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.pieceFile },
              ],
            },
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.fault,
              include: [
                { model: models.faultFile },
                {
                  model: models.user,
                  as: "responsible",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                {
                  model: models.user,
                  as: "reporters",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                {
                  model: models.cause,
                  as: "causes",
                  include: [
                    {
                      model: models.user,
                      as: "requested",
                      attributes: [
                        "id",
                        "name",
                        "firstName",
                        "lastName",
                        "email",
                        "role",
                        "isActive",
                      ],
                    },
                    { model: models.causeFile },
                  ],
                },
                { model: models.piece },
              ],
            },
            { model: models.componentFile },
          ],
        },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        { model: models.area },
        { model: models.plant },
        { model: models.sublevel },
        { model: models.machineFile },
        { model: models.task },
      ],
    });
  }

  // create machine
  async createMachine(machine, stageIds) {
    return withTransaction(async (transaction) => {
      const previousMachine = await Machine.findOne({
        where: {
          internal_name: machine.internal_name,
          sublevelId: machine.sublevelId,
          serie_number: machine.serie_number,
          isActive: 1,
        },
      });
      if (previousMachine) {
        throw new Error("Duplicated machine found. Aborting operation");
      }
      if (!stageIds) {
        throw new Error("Stages are required");
      }
      const createdMachine = await Machine.create(machine, { transaction });
      const cleanStages = stageIds.map((stageId) => ({
        machineId: createdMachine.id,
        stageId,
      }));

      await MachineStage.bulkCreate(cleanStages, { transaction });
      return createdMachine;
    });
  }

  // update machine
  async updateMachine(machineId, machine, stageIds) {
    return withTransaction(async (transaction) => {
      const updatedMachine = await Machine.update(
        machine,
        {
          where: { id: machineId },
        },
        { transaction }
      );
      if (stageIds) {
        const cleanStageIds = stageIds.map((stageId) => ({
          machineId,
          stageId,
        }));

        await MachineStage.destroy(
          {
            where: {
              machineId,
            },
          },
          { transaction }
        );
        await MachineStage.bulkCreate(cleanStageIds, { transaction });
      }
      return updatedMachine;
    });
  }

  // delete machine by id
  async deleteMachine(machineId) {
    await Machine.update(
      { isActive: 0 },
      {
        where: { id: machineId },
      }
    );

    return { success: true };
  }
}
