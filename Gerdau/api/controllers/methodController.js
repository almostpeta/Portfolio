import sequelize from "../db/dbconection.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
import User from "./userController.js";
import { sendMail } from "../utils/sendMail.js";

const models = sequelize.models;
const Method = models.method;

const user = new User();

export default class methodService {
  // find all method
  async getAllMethod() {
    return await Method.findAll({
      include: [{ model: models.methodFile }, { model: models.solution }],
    });
  }

  // find  method
  async getMethods(value) {
    return await Method.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: "%" + value + "%" } },
          { status: { [Op.like]: "%" + value + "%" } },
          { description: { [Op.like]: "%" + value + "%" } },
        ],
      },
    });
  }

  // find one method
  async getOneMethod(methodId) {
    return await Method.findOne({
      where: { id: methodId },
      include: [{ model: models.methodFile }, { model: models.solution }],
    });
  }

  // create method
  async createMethod(method) {
    const methodDB = await Method.create(method);
    return methodDB;
  }

  // update method
  async updateMethod(methodId, method) {
    return await Method.update(method, {
      where: { id: methodId },
    });
  }

  // delete method by id
  async deleteMethod(methodId) {
    return await Method.update(
      { isActive: 0 },
      {
        where: { id: methodId },
        raw: true,
      }
    );
  }

  // delete method by solution
  async deleteMethodBySolution(solutionId) {
    return await Method.update(
      { isActive: 0 },
      {
        where: { solutionId: solutionId },
        raw: true,
      }
    );
  }
}
