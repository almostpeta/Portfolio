import UserService from "../controllers/userController.js";
import CauseService from "../controllers/causeController.js";
import CauseFileService from "../controllers/causeFileController.js";
import SolutionService from "../controllers/solutionController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import { sendMailStatus, sendMailReOpen } from "../utils/sendMail.js";
import { adminOnly, forbiddenForOperator } from "../utils/verifyToken.js";
import { ROLES, CAUSE_STATUSES } from "../utils/constants.js";

const userServices = new UserService();
const causeServices = new CauseService();
const causeFileServices = new CauseFileService();
const solutionServices = new SolutionService();

export default class CauseRouter {
  constructor(deps) {
    this.logger = deps.logger.child({ service: "causeRouter" });
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllCauses));
    this.router.get("/getCauses/:value", catchAsync(this.getCauses));
    this.router.get("/getCausesByStatus", catchAsync(this.getCausesByStatus));
    this.router.get("/getOne/:id", catchAsync(this.getOneCauseById));
    this.router.get("/getOne/name/:name", catchAsync(this.getOneCause));
    this.router.post(
      "/create",
      [forbiddenForOperator, upload.array("files")],
      catchAsync(this.createCause)
    );
    this.router.put(
      "/update/:id",
      [forbiddenForOperator, upload.any()],
      catchAsync(this.updateCause)
    );
    this.router.put(
      "/status/:id",
      [adminOnly, upload.any()],
      catchAsync(this.updateCauseStatus)
    );

    this.router.put(
      "/resend/:id",
      forbiddenForOperator,
      catchAsync(this.resendCause)
    );

    this.router.delete("/delete/:id", adminOnly, catchAsync(this.deleteCause));
    this.router.get("/similarCauses", catchAsync(this.getSimilarCauses));
  }

  async getAllCauses(req, res) {
    const data = await causeServices.getAllCauses(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate),
      req.user.role === ROLES.ADMIN
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getCauses(req, res) {
    const value = req.params.value;
    const data = await causeServices.getCauses(
      value,
      req.user.role === ROLES.ADMIN
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getCausesByStatus(req, res) {
    const status = req.query.status;
    const data = await causeServices.getCausesByStatus(status);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneCause(req, res) {
    let nameCause = req.params.name;
    const data = await causeServices.getOneCause(nameCause);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneCauseById(req, res) {
    let causeId = req.params.id;
    const data = await causeServices.getOneCauseById(
      causeId,
      req.user.role === ROLES.ADMIN
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async createCause(req, res) {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const cause = {
      name: req.body.name,
      description: req.body.description,
      requestedId: (isAdmin && req.body.requestedId) || req.user.id, // if admin, then requestedId can be set
      status: (isAdmin && req.body.status) || CAUSE_STATUSES.REQUESTED, // if admin, then status can be set
      reason: req.body.reason || "",
      relevant_data: req.body.relevant_data || "",
      reject_reason: "",
      isActive: 1,
    };

    const data = await causeServices.createCause(cause);
    await causeFileServices.uploadMany({
      files: req.files,
      causeId: data.id,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateCause(req, res) {
    const causeId = req.params.id;
    const isAdmin = req.user.role === ROLES.ADMIN;
    const cause = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.status && isAdmin && { status: req.body.status }),
      ...(req.body.requestedId &&
        isAdmin && { requestedId: req.body.requestedId }),
      ...(req.body.reason && { reason: req.body.reason }),
      ...(req.body.relevant_data && { relevant_data: req.body.relevant_data }),
    };

    const data = await causeServices.updateCause(causeId, cause);

    await causeFileServices.uploadMany({
      files: req.files,
      causeId: data.id,
    });

    const deleteFiles = req.body.deleteFiles;
    if (deleteFiles) {
      deleteFiles.forEach(async (fileId) => {
        await causeFileServices.deleteCauseFile(fileId);
      });
    }

    const causeDB = await causeServices.getOneCauseById(causeId);

    res.send(new Search(200, "Success", "Success", causeDB));
  }

  async updateCauseStatus(req, res) {
    let cause = "";
    const causeId = req.params.id;
    const lowerCaseStatus = req.body.status?.toLowerCase();

    if (CAUSE_STATUSES.APPROVED.toLowerCase() === lowerCaseStatus) {
      cause = {
        status: CAUSE_STATUSES.APPROVED,
      };
    } else if (CAUSE_STATUSES.REJECTED.toLowerCase() === lowerCaseStatus) {
      cause = {
        status: CAUSE_STATUSES.REJECTED,
        reject_reason: req.body.reject_reason,
      };
    }

    await causeServices.updateCause(causeId, cause);
    const causeDB = await causeServices.getOneCauseById(causeId);

    const recipient = causeDB.requested;
    sendMailStatus({
      email: recipient.email,
      userName: recipient.name,
      reason: process.env.CAUSE,
      name: causeDB.name,
      resolution: causeDB.status,
      url: process.env.URL_CAUSE + causeDB.id,
      reject_reason: causeDB.reject_reason,
    });
    res.send(new Search(200, "Success", "Success", causeDB));
  }

  async resendCause(req, res) {
    const causeId = req.params.id;

    const cause = {
      status: CAUSE_STATUSES.REQUESTED,
    };

    await causeServices.updateCause(causeId, cause);
    const causeDB = await causeServices.getOneCauseById(causeId);

    const recipients = await userServices.getUser(ROLES.ADMIN);
    recipients.forEach((recipient) => {
      sendMailReOpen({
        email: recipient.email,
        username: recipient.name,
        reason: process.env.CAUSE + " " + causeDB.name,
        resolution: CAUSE_STATUSES.REQUESTED,
        url: process.env.URL_CAUSE + causeDB.id,
      });
    });
    res.send(new Search(200, "Success", "Success", causeDB));
  }

  async deleteCause(req, res) {
    let causeId = req.params.id;
    await solutionServices.deleteSolutionByCause(causeId);
    await causeFileServices.deleteCauseFileByCause(causeId);
    const data = await causeServices.deleteCause(causeId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getSimilarCauses(req, res) {
    const { causeIds } = req.query;
    const similarCauses = await causeServices.getSimilarCauses(causeIds);
    res.send(new Search(200, "Success", "Success", similarCauses));
  }
}
