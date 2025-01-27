import sequelize from "../db/dbconection.js";
import solutionService from "../controllers/solutionController.js";
import { SOLUTION_STATUSES } from "../utils/constants.js";
import Sequelize from "sequelize";

const models = sequelize.models;
const FaultMethod = models.faultMethod;
const SolutionService = new solutionService();
const solution = models.solution;
const Op = Sequelize.Op;

export default class FaultMethodService {
  async associateMethods(faultId, methods) {
    const erroneousMethods = methods.filter((method) => !method.isActive);
    if (erroneousMethods.length > 0) {
      throw new Error("Only active methods are valid");
    }
    const solutionIds = methods.map((method) => method.solutionId); // for each method, pick the solutionId
    // find if any solution is erroneous (inactive or rejected)
    const erroneousSolutions = await solution.findAll({
      where: {
        id: { [Op.in]: solutionIds },
        [Op.or]: [
          {
            isActive: false,
          },
          {
            status: SOLUTION_STATUSES.REJECTED,
          },
        ],
      },
    });
    const existingSolutions = await solution.findAll({
      where: {
        id: { [Op.in]: solutionIds },
      },
    });
    if (existingSolutions.length !== solutionIds.length) {
      throw new Error("Method with unexisting solution sent");
    }
    if (erroneousSolutions.length > 0) {
      throw new Error(
        "Only active and approved or requested solutions are valid"
      );
    }
    const faultMethodRecords = methods.map((method) => ({
      faultId: parseInt(faultId),
      methodId: parseInt(method.id),
    }));
    const createdRecords = await FaultMethod.bulkCreate(faultMethodRecords);
    return createdRecords;
  }
}
