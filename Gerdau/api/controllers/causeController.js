import sequelize from "../db/dbconection.js";
import Sequelize from "sequelize";
import User from "./userController.js";
import { sendMail } from "../utils/sendMail.js";
import {
  ROLES,
  CAUSE_STATUSES,
  SOLUTION_STATUSES,
} from "../utils/constants.js";
const lodash = require("lodash");

const Op = Sequelize.Op;

const models = sequelize.models;
const Cause = models.cause;
const Fault = models.fault;
const CauseFault = models.causeFault;

const user = new User();

export default class CauseService {
  // find all causes
  async getAllCauses(startDate, endDate, isAdmin) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    const whereClause = { createdAt: { [Op.between]: [startDate, endDate] } };
    // if (!isAdmin) {
    whereClause.isActive = 1;
    // }

    return await Cause.findAll(
      {
        where: whereClause,
        include: [
          {
            model: models.user,
            as: "requested",
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
          { model: models.fault },
          { model: models.solution },
        ],
      },
      { raw: true }
    );
  }

  // find all causes
  async getCauses(value, isAdmin) {
    const whereClause = {
      [Op.or]: [
        { name: { [Op.like]: "%" + value + "%" } },
        { status: { [Op.like]: "%" + value + "%" } },
        { reason: { [Op.like]: "%" + value + "%" } },
      ],
    };

    // if (!isAdmin) {
    whereClause.isActive = 1;
    // }

    return await Cause.findAll(
      {
        where: whereClause,
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
          { model: models.fault },
          { model: models.solution },
        ],
      },
      { raw: true }
    );
  }

  async getCausesByStatus(value) {
    return await Cause.findAll(
      {
        where: {
          ...(value && {
            [Op.or]: [{ status: { [Op.like]: "%" + value + "%" } }],
          }),
          [Op.and]: [{ isActive: 1 }],
        },
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
          { model: models.fault },
          { model: models.solution },
        ],
      },
      { raw: true }
    );
  }

  // find one cause
  async getOneCause(nameCause, isAdmin) {
    const whereClause = { name: nameCause };
    if (!isAdmin) {
      whereClause.isActive = 1;
    }

    return await Cause.findOne(
      {
        where: whereClause,
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
          { model: models.fault },
          { model: models.solution, where: { isActive: 1 } },
        ],
      },
      { raw: true }
    );
  }

  // find one cause
  async getOneCauseById(causeId, isAdmin) {
    const whereClause = { id: causeId };
    // if (!isAdmin) {
    whereClause.isActive = 1;
    // }

    return await Cause.findOne(
      {
        where: whereClause,
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
          { model: models.fault },
          { model: models.solution, required: false, where: { isActive: 1 } },
        ],
      },
      { raw: true }
    );
  }

  // create cause
  async createCause(cause) {
    const causeDB = await Cause.create(cause);

    const responsibles = await user.getUser(ROLES.ADMIN);
    responsibles.forEach((resp) => {
      sendMail({
        email: resp.email,
        username: resp.name,
        reason: process.env.CAUSE,
        url: process.env.URL_CAUSE + causeDB.id,
      });
    });

    return causeDB;
  }

  // update cause
  async updateCause(causeId, cause) {
    return await Cause.update(cause, {
      where: { id: causeId },
    });
  }

  // delete cause
  async deleteCause(causeId) {
    return await Cause.update(
      { isActive: 0 },
      {
        where: { id: causeId },
      }
    );
  }

  async getCause() {
    return Cause.findAll(
      {
        where: { status: "Solicitada" },
      },
      { raw: true }
    );
  }

  async getRelatedCauses({ key, id, faultId, existingIds = [] }) {
    // all active faults where id != faultId
    const faults = await Fault.findAll({
      where: { [key]: id, isActive: 1, id: { [Op.not]: faultId } },
    });

    const faultIds = lodash.mapValues(faults, "id");

    const causeFaults = await CauseFault.findAll({
      where: {
        faultId: Object.values(faultIds),
      },
    });

    const causeIds = lodash.mapValues(causeFaults, "causeId");
    const causes = await Cause.findAll({
      where: {
        id: Object.values(causeIds),
        isActive: 1,
        [Op.or]: [
          { status: CAUSE_STATUSES.APPROVED },
          { status: CAUSE_STATUSES.REQUESTED },
        ],
        ...(existingIds.length > 0 && {
          [Op.not]: [{ id: existingIds }],
        }),
      },
    });

    return causes;
  }

  async getComponentSuggestedCauses(componentId, faultId) {
    return this.getRelatedCauses({
      key: "componentId",
      id: componentId,
      faultId,
    });
  }

  async getPieceSuggestedCauses(pieceId, faultId, existingIds) {
    return this.getRelatedCauses({
      key: "pieceId",
      id: pieceId,
      faultId,
      existingIds,
    });
  }

  async getMostUsedCauses(existingIds) {
    const componentCauses = await Cause.findAll({
      where: {
        isActive: 1,
        status: CAUSE_STATUSES.APPROVED,
        ...(existingIds.length > 0 && { [Op.not]: [{ id: existingIds }] }),
      },
      limit: 5,
      order: [["number_of_uses", "DESC"]],
    });
    return componentCauses;
  }

  /**
   * Similar causes are the ones that are related to the same faults
   * @param {*} CauseIds list of ids that the method will search
   * for similar
   * @returns list of similar causes and list of restOfCauses
   * Both lists are APPROVED causes and ordered by number of uses
   */
  async getSimilarCauses(causeIds) {
    causeIds = Array.isArray(causeIds)
      ? causeIds.map((id) => +id)
      : [+causeIds];
    const causeFaults = await CauseFault.findAll({
      where: { causeId: causeIds },
    });
    const faultIds = causeFaults.map((cf) => cf.faultId);
    const similarCauseFaults = await CauseFault.findAll({
      where: { faultId: faultIds },
    });
    const similarCauseIds = similarCauseFaults.map((scf) => scf.causeId);
    const similarCauses = await Cause.findAll({
      where: {
        id: similarCauseIds,
        isActive: 1,
        status: CAUSE_STATUSES.APPROVED,
      },
      order: [["number_of_uses", "DESC"]],
    });

    const similarCausesWithoutDups = lodash.remove(
      similarCauses,
      (similarCause) => !causeIds.includes(similarCause.id)
    );

    const similarCausesWithoutDupIds = lodash.mapValues(
      similarCausesWithoutDups,
      "id"
    );

    const restOfCauses = await Cause.findAll({
      where: {
        status: CAUSE_STATUSES.APPROVED,
        [Op.not]: [
          { id: Object.values(similarCausesWithoutDupIds).concat(causeIds) },
        ],
      },
      order: [["number_of_uses", "DESC"]],
    });

    return {
      similarCauses: similarCausesWithoutDups,
      restOfCauses,
    };
  }

  async getCausesToResolveFault(faultId) {
    const faultCauses = await CauseFault.findAll({
      where: {
        faultId,
      },
    });
    const causeIds = faultCauses.map((fc) => fc.causeId);
    const causes = await Cause.findAll({
      where: {
        id: { [Op.in]: causeIds },
        status: { [Op.not]: CAUSE_STATUSES.REJECTED },
      },
      include: [
        {
          required: false,
          model: models.solution,
          where: {
            status: { [Op.not]: SOLUTION_STATUSES.REJECTED },
            isActive: 1,
          },
          include: [
            { model: models.method, required: false, where: { isActive: 1 } },
          ],
        },
      ],
    });

    return causes;
  }
}
