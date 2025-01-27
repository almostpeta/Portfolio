import sequelize from "../db/dbconection.js";
import User from "./userController.js";
import { sendMail } from "../utils/sendMail.js";
import { ROLES, SOLUTION_STATUSES } from "../utils/constants.js";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

const models = sequelize.models;
const Solution = models.solution;
const CauseFault = models.causeFault;
const Cause = models.cause;

const user = new User();

export default class solutionService {
  // find all solution
  async getAllSolution(startDate, endDate) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    return await Solution.findAll(
      {
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
          isActive: 1,
        },
        include: [
          { model: models.solutionFile },
          { model: models.cause },
          { model: models.method },
          { model: models.user, as: "requested" },
        ],
      },
      { raw: true }
    );
  }

  // find  solution
  async getSolutions(value) {
    return await Solution.findAll(
      {
        where: {
          [Op.or]: [
            { name: { [Op.like]: "%" + value + "%" } },
            { status: { [Op.like]: "%" + value + "%" } },
            { description: { [Op.like]: "%" + value + "%" } },
          ],
          [Op.and]: [{ isActive: 1 }],
        },
        include: [
          { model: models.solutionFile },
          { model: models.cause },
          { model: models.method },
          { model: models.user, as: "requested" },
        ],
      },
      { raw: true }
    );
  }

  async getSolutionsByStatus(value) {
    return await Solution.findAll(
      {
        where: {
          [Op.or]: [{ status: { [Op.like]: "%" + value + "%" } }],
          [Op.and]: [{ isActive: 1 }],
        },
        include: [
          { model: models.solutionFile },
          { model: models.cause },
          { model: models.method },
        ],
      },
      { raw: true }
    );
  }

  // find one solution
  async getOneSolution(solutionId) {
    return await Solution.findOne(
      {
        where: { id: solutionId, isActive: 1 },
        include: [
          { model: models.solutionFile },
          { model: models.cause },
          { model: models.method },
          { model: models.user, as: "requested" },
        ],
      },
      { raw: true }
    );
  }

  // create solution
  async createSolution(solution) {
    const solutionDB = await Solution.create(solution);
    const responsibles = await user.getUser(ROLES.ADMIN);
    responsibles.forEach((resp) => {
      sendMail({
        email: resp.email,
        username: resp.name,
        reason: process.env.SOLUTION,
        url: process.env.URL_SOLUTION + solutionDB.id,
      });
    });

    return solutionDB;
  }

  // update solution
  async updateSolution(solutionId, solution) {
    return await Solution.update(solution, {
      where: { id: solutionId },
    });
  }

  async getSolution() {
    return Solution.findAll({
      where: { status: SOLUTION_STATUSES.REQUESTED, isActive: 1 },
    });
  }
  // delete solution
  async deleteSolution(solutionId) {
    return await Solution.update(
      { isActive: 0 },
      {
        where: { id: solutionId },
      }
    );
  }
  // delete solution by cause
  async deleteSolutionByCause(causeId) {
    return await Solution.update(
      { isActive: 0 },
      {
        where: { causeId: causeId },
      }
    );
  }
}
