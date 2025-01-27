import FaultService from "../controllers/faultController.js";
import FaultFileService from "../controllers/faultFileController.js";
import { Router } from "express";
import { catchAsync, Search, genericFileToBase64 } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import UserService from "../controllers/userController.js";
import ComponentService from "../controllers/componentController.js";
import PieceService from "../controllers/pieceController.js";
import FaultMethodService from "../services/FaultMethod.js";
import CauseService from "../controllers/causeController.js";
import JSZip from "jszip";
import { verifyToken } from "../utils/verifyToken.js";
import { ROLES } from "../utils/constants.js";

const faultService = new FaultService();
const faultFileService = new FaultFileService();
const userService = new UserService();
const componentService = new ComponentService();
const pieceService = new PieceService();
const faultMethodService = new FaultMethodService();
const causeService = new CauseService();

export default class FaultRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllFaults));
    this.router.get("/getOne/:id", catchAsync(this.getOneFault));
    this.router.get("/get/:faultNumber", catchAsync(this.checkFaultNumber)); //fault_number
    this.router.post("/create", upload.any(), catchAsync(this.createFault));
    this.router.put(
      "/update/:id",
      [verifyToken, upload.any()],
      catchAsync(this.updateFault)
    );
    this.router.post(
      "/:id/causes",
      upload.array("files"),
      catchAsync(this.associateCauses)
    );
    this.router.get(
      "/:id/causes-assistant",
      catchAsync(this.associateCausesFromAssistant)
    );
    this.router.post(
      "/:id/methods",
      upload.array("files"),
      catchAsync(this.associateMethods)
    );
    this.router.get(
      "/:id/suggestedCauses",
      catchAsync(this.getSuggestedCauses)
    );
    this.router.get(
      "/:id/resolve-fault-causes",
      catchAsync(this.getCausesToResolveFault)
    );
    this.router.delete("/delete/:id", catchAsync(this.deleteFault));
    this.router.get(
      "/getFaultAndTaskByDate",
      catchAsync(this.getFaultAndTaskByDate)
    );
    this.router.get("/faultZip/:id", catchAsync(this.faultZip));
    this.router.post("/:id/setResolved", catchAsync(this.setFaultAsResolved));
    this.router.get("/faultsByCauses", catchAsync(this.getFaultsByCauses));
  }

  async getAllFaults(req, res) {
    const data = await faultService.getAllFaults(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneFault(req, res) {
    let faultId = req.params.id;
    const data = await faultService.getOneFault(faultId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async checkFaultNumber(req, res) {
    let faultNumber = req.params.faultNumber;
    const data = await faultService.checkFaultNumber(faultNumber);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createFault(req, res) {
    if (
      req.body.fault_number &&
      !(await faultService.checkFaultNumber(req.body.fault_number))
    ) {
      throw { status: 500, message: "fault number duplicate." };
    }

    const fault = {
      type: "falla",
      state: req.body.state,
      name: req.body.name,
      ...(req.body.clasification && {
        clasification:
          typeof req.body.clasification === "object"
            ? req.body.clasification.join()
            : req.body.clasification,
      }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.description_record && {
        description_record: req.body.description_record,
      }),
      pieceId: req.body.pieceId,
      componentId: req.body.componentId,
      start_date_time: Date.parse(req.body.start_date_time),
      responsibleId: req.body.responsibleId,
      priority: req.body.priority,
      end_date_time: Date.parse(req.body.end_date_time) || null,
      consequences: req.body.consequences || "",
      consequences_record: req.body.consequences_record || "",
      stageId: req.body.stageId || null,
      relevant_data: req.body.relevant_data || "",
      relevant_data_record: req.body.relevant_data_record || "",
      description: req.body.description || "",
      description_record: req.body.description_record || "",
      pieceId: req.body.pieceId || undefined,
      are_measures: req.body.are_measures || "",
      analyzed_measures: req.body.analyzed_measures || "",
      fault_number: req.body.fault_number || "",
      reporters: req.body.reporters || [],
      isActive: 1,
    };

    const data = await faultService.createFault(fault);

    await faultFileService.uploadMany({
      files: req.files,
      faultId: data.id,
    });

    await faultService.countFaults(
      data.id,
      data.clasification.split(","),
      undefined
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateFault(req, res) {
    const faultId = req.params.id;
    const oldFaultDB = await faultService.getOneFault(faultId);

    const fault = {
      type: req.body.type,
      name: req.body.name,
      ...(req.body.clasification && {
        clasification:
          typeof req.body.clasification === "object"
            ? req.body.clasification.join()
            : req.body.clasification,
      }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.description_record && {
        description_record: req.body.description_record,
      }),
      pieceId: req.body.pieceId || null,
      componentId: req.body.componentId,
      start_date_time: Date.parse(req.body.start_date_time),
      ...(req.body.end_date_time && {
        end_date_time: Date.parse(req.body.end_date_time),
      }),
      responsibleId: req.body.responsibleId,
      consequences: req.body.consequences,
      ...(req.body.consequences_record && {
        consequences_record: req.body.consequences_record,
      }),
      stageId: req.body.stageId || null,
      ...(req.body.relevant_data && { relevant_data: req.body.relevant_data }),
      ...(req.body.relevant_data_record && {
        relevant_data_record: req.body.relevant_data_record,
      }),
      priority: req.body.priority,
      are_measures: req.body.are_measures,
      analyzed_measures: req.body.analyzed_measures,
      fault_number: req.body.fault_number,
      reporters: req.body.reporters?.trim().split(",") || [],
      isActive: 1,
    };

    const isAdmin = ROLES.ADMIN === req.user.role;
    if (isAdmin) {
      fault.state = req.body.state;
    }

    const data = await faultService.updateFault(faultId, fault);

    await faultFileService.uploadMany({
      files: req.files,
      faultId: faultId,
    });

    const deleteFiles = req.body.deleteFiles;

    if (deleteFiles) {
      deleteFiles.forEach(async (fileId) => {
        await faultFileService.deleteFaultFile(fileId);
      });
    }
    await faultService.countFaults(
      faultId,
      req.body.clasification.split(","),
      oldFaultDB.clasification.split(",")
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async associateCauses(req, res) {
    const faultId = req.params.id;
    const newCauseIds = JSON.parse(req.body.newCauseIds);
    const deletedCauseIds = JSON.parse(req.body.deletedCauseIds);
    const data = await faultService.associateCauses(
      faultId,
      newCauseIds,
      deletedCauseIds
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async associateCausesFromAssistant(req, res) {
    const { id } = req.params;
    const { causeIds = [] } = req.query;
    const data = await faultService.associateCausesFromAssistant(id, causeIds);
    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteFault(req, res) {
    let faultId = req.params.id;
    const data = await faultService.deleteFault(faultId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getSuggestedCauses(req, res) {
    const faultId = req.params.id;
    const suggestedCauses = await faultService.getSuggestedCauses(faultId);
    res.send(new Search(200, "Success", "Success", suggestedCauses));
  }

  async associateMethods(req, res) {
    const faultId = req.params.id;
    const methods = JSON.parse(req.body.methods) || [];
    const createdRecords = await faultMethodService.associateMethods(
      faultId,
      methods
    );
    res.send(new Search(200, "Success", "Success", createdRecords));
  }

  async getCausesToResolveFault(req, res) {
    const faultId = req.params.id;
    const solutions = await causeService.getCausesToResolveFault(faultId);
    res.send(new Search(200, "Success", "Success", solutions));
  }

  async getFaultAndTaskByDate(req, res) {
    const data = await faultService.getFaultAndTaskByDate(
      req.query.machineId,
      req.query.componentId,
      req.query.pieceId,
      req.query.order,
      req.query.type,
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getSuggestedCauses(req, res) {
    const faultId = req.params.id;
    const suggestedCauses = await faultService.getSuggestedCauses(faultId);
    res.send(new Search(200, "Success", "Success", suggestedCauses));
  }

  async faultZip(req, res) {
    const faultId = req.params.id;
    const faultFiles = await faultService.faultZip(faultId);
    const zipName = `falla-${faultId}.zip`;
    const zip = new JSZip();
    let file1;
    for (const file of faultFiles) {
      let b64 = genericFileToBase64(`${file}`);
      const result = zip.file(file, b64, { base64: true });
    }

    zip.generateAsync({ type: "base64" }).then((base64) => {
      res.send(new Search(200, "Success", "Success", base64));
    });
  }
  async setFaultAsResolved(req, res) {
    const faultId = req.params.id;
    const success = await faultService.setFaultAsResolved(faultId);
    res.send(new Search(200, "Success", "Success", success));
  }

  async getFaultsByCauses(req, res) {
    const causeIds = req.query.id;
    const faults = await faultService.getFaultsByCauses(causeIds);

    res.send(new Search(200, "Success", "Success", faults));
  }
}
