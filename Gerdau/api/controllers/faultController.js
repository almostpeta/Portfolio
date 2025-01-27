import FaultFileService from "./faultFileController.js";
import Sequelize from "sequelize";
import CauseService from "./causeController.js";
import User from "./userController.js";
import sequelize from "../db/dbconection.js";
import { sendMail } from "../utils/sendMail.js";
import { createPdf } from "../utils/dataToPdf.js";
import TaskServices from "./taskController.js";
const lodash = require("lodash");

const moment = require("moment");

const Op = Sequelize.Op;

const models = sequelize.models;
const Fault = models.fault;

const Machine = models.machine;
const Component = models.component;
const Piece = models.piece;
const Cause = models.cause;
const CauseFault = models.causeFault;
const Solution = models.solution;

const faultFileService = new FaultFileService();
const taskService = new TaskServices();
const user = new User();
const causeService = new CauseService();

export default class faultService {
  // find all faults
  async getAllFaults(startDate, endDate) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    return await Fault.findAll({
      where: {
        start_date_time: { [Op.between]: [startDate, endDate] },
        isActive: 1,
      },
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
        { model: models.component },
      ],
    });
  }

  async updateFault(faultId, fault) {
    const faultBD = await this.getOneFault(faultId);
    const faultJSON = faultBD.toJSON();
    const faultUpdated = await Fault.update(fault, {
      where: { id: faultId },
    });

    //agrego reporters nuevos
    fault.reporters?.forEach(async (userId) => {
      let reporterMatch = faultJSON.reporters.find(
        (reporter) => reporter.id == userId
      );
      const usu = await user.getOneUserId(userId);
      !reporterMatch && usu && faultBD.addReporters([usu.id]);
    });
    //elimino reporters viejos
    faultJSON.reporters.forEach(async (reporter) => {
      let reporterMatch = fault.reporters?.find((id) => id == reporter.id);
      const usu = await user.getOneUserId(reporter.id);
      !reporterMatch && usu && faultBD.removeReporters([usu.id]);
    });

    return faultUpdated;
  }

  async checkFaultNumber(faultNumber) {
    if (faultNumber != "") {
      const data = await Fault.findOne({
        where: { fault_number: faultNumber },
        raw: true,
      });
      if (data) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  // find one fault
  async getOneFault(faultId) {
    const fault = await Fault.findOne({
      where: { id: faultId, isActive: 1 },
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
        { model: models.component },
        { model: models.method, include: [{ model: models.solution }] },
        { model: models.stage, as: "stage" },
      ],
    });
    return fault;
  }

  // create Fault
  async createFault(fault) {
    const faultBD = await Fault.create(fault);
    if (typeof fault.reporters === "string") {
      fault.reporters && faultBD.addReporters([parseInt(fault.reporters)]);
    } else {
      fault.reporters.forEach(async (userId) => {
        userId && faultBD.addReporters([parseInt(userId)]);
      });
    }
    const responsible = await user.getOneUserId(faultBD.responsibleId);
    sendMail({
      email: responsible.email,
      username: responsible.name,
      reason: process.env.FAULT,
      url: process.env.URL_FAULT + faultBD.id,
    });
    const responsibles = await user.getUser(process.env.IN_CHARGE);
    responsibles.forEach((resp) => {
      sendMail({
        email: resp.email,
        username: resp.name,
        reason: process.env.FAULT,
        url: process.env.URL_FAULT + faultBD.id,
      });
    });
    return faultBD;
  }

  /**
   * Receives the causeIds and relate them appropriately to the fault
   * @param {*} faultId to relate the causes to
   * @param {*} newCauseIds new causes ids that user selected
   * @param {*} deletedCauseIds cause ids that the user removed from selection
   * @returns solutions related to the causes
   */
  async associateCauses(faultId, newCauseIds, deletedCauseIds) {
    const fault = await this.getOneFault(faultId);
    let unusableCause = false;
    newCauseIds.forEach(async (causeId) => {
      const cause = await causeService.getOneCauseById(causeId);
      if (!cause || cause.status !== "Aprobada") unusableCause = true;
    });
    if (!unusableCause) {
      await fault.removeCauses(deletedCauseIds);
      await fault.addCauses(newCauseIds);
      const cleanFaultCauses = await CauseFault.findAll({ where: { faultId } });
      const cleanCauseIds = cleanFaultCauses.map(
        (cleanFaultCause) => cleanFaultCause.causeId
      );

      const solutions = await Solution.findAll({
        where: { causeId: cleanCauseIds },
      });
      return solutions;
    }
    return "wrongly sent cause not yet aproved or inactive";
  }

  /**
   * Same purpose that associateCauses but this one overwrites
   * the related causes
   * @param {*} faultId
   * @param {*} causeIds
   * @returns Solutions related to the causes
   */
  async associateCausesFromAssistant(faultId, causeIds) {
    let transaction = null;
    try {
      causeIds = Array.isArray(causeIds)
        ? causeIds.map((id) => +id)
        : [+causeIds];
      transaction = await sequelize.transaction();
      const fault = await this.getOneFault(faultId);
      const cleanFaultCauses = await CauseFault.findAll({
        where: { faultId },
        attributes: ["causeId"],
      }).map((c) => c.causeId);

      const causeIdsToAdd = lodash.differenceWith(
        causeIds,
        cleanFaultCauses,
        lodash.isEqual
      );
      const causeIdsToDelete = lodash.differenceWith(
        cleanFaultCauses,
        causeIds,
        lodash.isEqual
      );

      await fault.removeCauses(causeIdsToDelete);
      await fault.addCauses(causeIdsToAdd);

      const solutions = await Solution.findAll({
        where: { causeId: causeIds },
      });

      await transaction.commit();
      return solutions;
    } catch (err) {
      await transaction.rollback();
    }
  }

  async countFaults(faultId, clasification, oldclasification) {
    const fault = await this.getOneFault(faultId);
    if (clasification) {
      //new clasifications - increment
      let clas = [];
      if (oldclasification) {
        clas = clasification.filter((x) => oldclasification.indexOf(x) === -1);
      } else {
        clas = clasification;
      }
      await this.incrementCountFaults(clas, fault.componentId, fault.pieceId);
    }
    if (oldclasification) {
      // old clasifications - decrement
      let oldClas = [];
      if (clasification) {
        oldClas = oldclasification.filter(
          (x) => clasification.indexOf(x) === -1
        );
      } else {
        oldClas = oldclasification;
      }
      await this.decrementCountFaults(
        oldClas,
        fault.componentId,
        fault.pieceId
      );
    }
  }

  async incrementCountFaults(clasification, componentId, pieceId) {
    const component = await Component.findOne({
      where: { id: componentId },
    });
    clasification.forEach(async (element) => {
      switch (element) {
        case "Eléctrica":
          await Machine.increment(
            { electric_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.increment(
            { electric_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.increment(
              { electric_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
        case "Mecánica":
          await Machine.increment(
            { mechanic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.increment(
            { mechanic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.increment(
              { mechanic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
        case "Hidráulica":
          await Machine.increment(
            { hydraulic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.increment(
            { hydraulic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.increment(
              { hydraulic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }

          break;
        case "Neumática":
          await Machine.increment(
            { neumatic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.increment(
            { neumatic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.increment(
              { neumatic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
      }
    });
  }

  async decrementCountFaults(oldclasification, componentId, pieceId) {
    const component = await Component.findOne({
      where: { id: componentId },
    });

    oldclasification.forEach(async (element) => {
      switch (element) {
        case "Eléctrica":
          await Machine.decrement(
            { electric_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.decrement(
            { electric_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.decrement(
              { electric_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
        case "Mecánica":
          await Machine.decrement(
            { mechanic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.decrement(
            { mechanic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.decrement(
              { mechanic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
        case "Hidráulica":
          await Machine.decrement(
            { hydraulic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.decrement(
            { hydraulic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.decrement(
              { hydraulic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }

          break;
        case "Neumática":
          await Machine.decrement(
            { neumatic_faults_count: +1 },
            { where: { id: component.machineId } }
          );
          await Component.decrement(
            { neumatic_faults_count: +1 },
            { where: { id: component.id } }
          );
          if (pieceId) {
            await Piece.decrement(
              { neumatic_faults_count: +1 },
              { where: { id: pieceId } }
            );
          }
          break;
      }
    });
  }

  // delete fault
  async deleteFault(faultId) {
    return await Fault.update(
      { isActive: 0 },
      {
        where: { id: faultId },
      }
    );
  }

  async getFault() {
    return Fault.findAll({
      where: { state: "En Progreso" },
    });
  }

  async getSuggestedCauses(faultId) {
    const fault = await this.getOneFault(faultId);
    const results = {};

    let existingIds = [];
    if (fault.componentId) {
      const causes = await causeService.getComponentSuggestedCauses(
        fault.componentId,
        faultId
      );
      results.relatedToComponent = causes;

      // add to list to avoid dups
      existingIds = existingIds.concat(causes.map((c) => c.id));
    }
    if (fault.pieceId) {
      const causes = await causeService.getPieceSuggestedCauses(
        fault.pieceId,
        faultId,
        [...existingIds]
      );
      results.relatedToPiece = causes;

      // add to list to avoid dups
      existingIds = existingIds.concat(causes.map((c) => c.id));
    }

    results.mostUsed = await causeService.getMostUsedCauses([...existingIds]);

    return results;
  }

  async getCausesRelatedToFault(faultId) {
    const causeFaultRecords = await CauseFault.findAll({ where: { faultId } });
    const causeIds = causeFaultRecords.map((cfr) => cfr.causeId);
    const causes = await Cause.findAll({ where: { id: causeIds } });

    return causes;
  }

  async getFaultAndTaskByDate(
    machineId,
    componentId,
    pieceId,
    order,
    type,
    startDate,
    endDate
  ) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    let tasks = [];
    if (type === "all" || !type || type === "task") {
      tasks = await taskService.getAllTasksFromComponentOrMachine(
        machineId,
        componentId,
        pieceId,
        startDate,
        endDate
      );
    }
    let faults = [];
    if ((type === "all" || !type || type === "fault") && !machineId) {
      faults = await this.getAllFaultsFromComponentOrMachine(
        componentId,
        pieceId,
        startDate,
        endDate
      );
    }

    lodash.forEach(faults, (f) => (f.eventType = "fault"));
    lodash.forEach(tasks, (t) => (t.eventType = "task"));
    const all = lodash.concat(tasks, faults);

    return all.sort((a, b) => {
      const dateA =
        a.eventType === "fault"
          ? a.start_date_time
          : a.complete_date || a.start_date;
      const dateB =
        b.eventType === "fault"
          ? b.start_date_time
          : b.complete_date || b.start_date;
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  }

  async getAllFaultsFromComponentOrMachine(
    componentId,
    pieceId,
    startDate,
    endDate
  ) {
    return Fault.findAll({
      where: {
        start_date_time: { [Op.between]: [startDate, endDate] },
        ...(componentId && { componentId }),
        ...(pieceId && { pieceId }),
        isActive: 1,
      },
    }).then((rows) => rows.map((r) => r.dataValues));
  }

  async setFaultAsResolved(faultId) {
    const response = await Fault.update(
      { state: "Resuelta" },
      { where: { id: faultId } }
    );
    return response;
  }

  async faultZip(faultId) {
    const fault = await Fault.findOne(
      {
        attributes: [
          ["name", "Título de la falla"],
          ["priority", "Prioridad"],
          ["state", "Estado"],
          ["clasification", "Clasificación"],
          ["description", "Descripción"],
          ["start_date_time", "Fecha de Inicio de la falla"],
          ["end_date_time", "Fecha de Fin de la falla"],
          ["consequences", "Consecuencias"],
          ["relevant_data", "Datos relevantes"],
          ["are_measures", "¿Hay Mediciones?"],
          ["analyzed_measures", "Mediciones analizadas"],
          ["fault_number", "Número Falla"],
          "responsibleId",
          "componentId",
          "pieceId",
          "stageId",
        ],
        where: { id: faultId },
        include: [
          { model: models.component },
          { model: models.piece },
          { model: models.user, as: "responsible" },
          { model: models.stage, as: "stage" },
        ],
      },
      { raw: true }
    ).then((r) => {
      return r.dataValues;
    });
    fault["Responsable"] = fault["responsible"];
    fault["Componente"] = fault["component"];
    fault["Pieza"] = fault["piece"];
    delete fault["componentId"];
    delete fault["responsibleId"];
    delete fault["stageId"];
    delete fault["pieceId"];
    delete fault["responsible"];
    delete fault["component"];
    delete fault["piece"];

    const pdfPath = createPdf(fault, "falla");
    let faultFiles = await faultFileService.getFileNamesFromFault(faultId);
    faultFiles = faultFiles.map((x) => x.file.split("\\").pop());
    faultFiles.push(pdfPath);
    return faultFiles;
  }

  async getFaultsByCauses(causeIds) {
    try {
      if (causeIds) {
        const result = await sequelize.query(
          `select * from faults f
          right join 
          (select cf.faultId, count(cf.causeId) as causesMatch from 
          (select * from causeFaults cf
          where cf.causeId IN (${
            causeIds.length > 1 ? causeIds.join(",") : causeIds[0]
          })) cf
          group by cf.faultId) cf on f.id = cf.faultId
          where causesMatch >= ${causeIds.length}`,
          { type: Sequelize.QueryTypes.SELECT }
        );
        return result;
      } else {
        return await Fault.findAll();
      }
    } catch (e) {
      console.log(e);
    }
  }
}
