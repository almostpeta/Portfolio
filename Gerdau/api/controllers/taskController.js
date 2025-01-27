import sequelize from "../db/dbconection.js";
import Sequelize from "sequelize";
import { clean } from "../utils/utils.js";

const moment = require("moment");

const Op = Sequelize.Op;
const models = sequelize.models;
const Task = models.task;
const User = models.user;
export default class TaskServices {
  // find all tasks
  async getAllTasks(responsibleId, endDate, startDate, machineId, status) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    const where = { responsibleId, machineId, status };
    await clean(where);
    return await Task.findAll(
      {
        where: { ...where, createdAt: { [Op.between]: [startDate, endDate] } },
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
            as: "responsible",
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
            as: "requested",
          },
          { model: models.piece },
          { model: models.component },
          { model: models.machine },
        ],
      },
      { raw: true }
    );
  }

  async getAllTasksFromComponentOrMachine(
    machineId,
    componentId,
    pieceId,
    startDate,
    endDate
  ) {
    return await Task.findAll(
      {
        where: {
          [Op.or]: {
            complete_date: { [Op.between]: [startDate, endDate] },
            start_date: { [Op.between]: [startDate, endDate] },
          },
          ...(machineId && { machineId }),
          ...(componentId && { componentId }),
          ...(pieceId && { pieceId }),
          isActive: 1,
        },
      },
      { raw: true }
    ).then((rows) => rows.map((r) => r.dataValues));
  }

  // find one task
  async getOneTask(taskId, responsibleId) {
    return await Task.findOne(
      {
        where: { id: taskId, ...(responsibleId && { responsibleId }) },
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
            as: "responsible",
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
            as: "requested",
          },
          { model: models.piece },
          { model: models.component },
          { model: models.machine },
        ],
      },
      { raw: true }
    );
  }

  // find tasks by user
  async getTasksByUser(value) {
    if (!isNaN(value)) {
      return await Task.findAll({
        where: { responsibleId: value },
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
            as: "responsible",
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
            as: "requested",
          },
        ],
        raw: true,
      });
    } else {
      return await Task.findAll({
        where: {
          responsibleId: await User.findOne({
            attributes: ["id"],
            where: {
              email: { [Op.eq]: value },
            },
          }).then(function (result) {
            if (result) {
              var responsibleId = result.id;
              return responsibleId; // This is what I need to do
            }
          }),
        },
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
            as: "responsible",
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
            as: "requested",
          },
        ],
        raw: true,
      });
    }
  }

  // find task by machine
  async getTasksByMachine(machine) {
    return await Task.findAll(
      {
        where: { machineId: machine },
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
            as: "responsible",
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
            as: "requested",
          },
          { model: models.piece },
          { model: models.component },
          { model: models.machine },
        ],
      },
      { raw: true }
    );
  }

  // find task by component
  async getTasksByComponent(component) {
    return await Task.findAll(
      {
        where: { componentId: component },
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
            as: "responsible",
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
            as: "requested",
          },
          { model: models.piece },
          { model: models.component },
          { model: models.machine },
        ],
      },
      { raw: true }
    );
  }

  // find task by piece
  async getTasksByPiece(piece) {
    return await Task.findAll(
      {
        where: { pieceId: piece },
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
            as: "responsible",
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
            as: "requested",
          },
          { model: models.piece },
          { model: models.component },
          { model: models.machine },
        ],
      },
      { raw: true }
    );
  }

  // create task
  async createTask(task) {
    return await Task.create(task);
  }

  // update task
  async updateTask(taskId, task) {
    return await Task.update(task, { where: { id: taskId } });
  }

  // delete task
  async deleteTask(taskId) {
    return await Task.update({ isActive: 0 }, { where: { id: taskId } });
  }

  async setTaskAsCompleted(taskId) {
    return await Task.update(
      { status: "Completado", complete_date: new Date() },
      { where: { id: taskId } }
    );
  }
}
