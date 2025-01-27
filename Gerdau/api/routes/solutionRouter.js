import SolutionServices from "../controllers/solutionController.js";
import UserServices from "../controllers/userController.js";
import SolutionFileServices from "../controllers/solutionFileController.js";
import MethodServices from "../controllers/methodController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import { sendMailReOpen, sendMailStatus } from "../utils/sendMail.js";
import { adminOnly, forbiddenForOperator } from "../utils/verifyToken.js";
import { SOLUTION_STATUSES, ROLES } from "../utils/constants.js";

const userServices = new UserServices();
const solutionServices = new SolutionServices();
const solutionFileServices = new SolutionFileServices();
const methodServices = new MethodServices();

export default class SolutionRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllSolutions));
    this.router.get("/getSolutions/:value", catchAsync(this.getSolutions));
    this.router.get(
      "/getSolutionsByStatus",
      catchAsync(this.getSolutionsByStatus)
    );
    this.router.get("/getOne/:id", catchAsync(this.getOneSolution));
    this.router.post(
      "/create",
      [forbiddenForOperator, upload.array("files")],
      catchAsync(this.createSolution)
    );
    this.router.put(
      "/update/:id",
      [forbiddenForOperator, upload.any()],
      catchAsync(this.updateSolution)
    );
    this.router.put(
      "/status/:id",
      [adminOnly, upload.any()],
      catchAsync(this.updateSolutionStatus)
    );
    this.router.put(
      "/resend/:id",
      [forbiddenForOperator],
      catchAsync(this.resendSolution)
    );
    this.router.delete(
      "/delete/:id",
      [adminOnly, upload.any()],
      catchAsync(this.deleteSolution)
    );
  }

  async getAllSolutions(req, res) {
    const data = await solutionServices.getAllSolution(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getSolutions(req, res) {
    let value = req.params.value;
    const data = await solutionServices.getSolutions(value);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getSolutionsByStatus(req, res) {
    let value = req.params.status;
    const data = await solutionServices.getSolutionsByStatus(value);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneSolution(req, res) {
    let solutionId = req.params.id;
    const data = await solutionServices.getOneSolution(solutionId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createSolution(req, res) {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const solutionDefaultValue = SOLUTION_STATUSES.REQUESTED;
    const requestedIdDefaultValue = req.user.id;
    const solution = {
      name: req.body.name,
      description: req.body.description,
      relevant_data: req.body.relevant_data || "",
      reject_reason: req.body.reject_reason || "",
      causeId: req.body.cause,
      isActive: 1,
      status: isAdmin
        ? req.body.status || solutionDefaultValue
        : solutionDefaultValue,
      requestedId: isAdmin
        ? req.user.id || requestedIdDefaultValue
        : requestedIdDefaultValue,
    };
    const data = await solutionServices.createSolution(solution);
    await solutionFileServices.uploadMany({
      files: req.files,
      solutionId: data.id,
    });

    res.send(new Search(200, "Success", "Success", data));
  }

  async updateSolution(req, res) {
    const solutionId = req.params.id;
    const isAdmin = req.user.role === ROLES.ADMIN;
    const solution = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.relevant_data && { relevant_data: req.body.relevant_data }),
      ...(req.body.status && isAdmin && { status: req.body.status }),
      ...(req.body.requestedId &&
        isAdmin && { requestedId: req.body.requestedId }),
      ...(req.body.cause && { causeId: req.body.cause }),
      isActive: 1,
    };
    const data = await solutionServices.updateSolution(solutionId, solution);
    await solutionFileServices.uploadMany({
      files: req.files,
      solutionId: solutionId,
    });
    const deleteFiles =
      req.body.deleteFiles && JSON.parse(req.body.deleteFiles);
    if (deleteFiles?.length > 0) {
      deleteFiles.forEach(async (fileId) => {
        await solutionFileServices.deleteSolutionFile(fileId);
      });
    }

    const solutionDB = await solutionServices.getOneSolution(solutionId);
    res.send(new Search(200, "Success", "Success", solutionDB));
  }

  async updateSolutionStatus(req, res) {
    let solution = "";
    const solutionId = req.params.id;
    const { status, reject_reason } = req.body;
    const sendEmailToAdmins = SOLUTION_STATUSES.REQUESTED === status;

    if (
      SOLUTION_STATUSES.APPROVED === status ||
      SOLUTION_STATUSES.REQUESTED === status
    ) {
      solution = {
        status,
      };
    } else if (SOLUTION_STATUSES.REJECTED === status) {
      solution = {
        status,
        reject_reason,
      };
    }

    await solutionServices.updateSolution(solutionId, solution);
    const solutionDB = await solutionServices.getOneSolution(solutionId);
    const recipient = solutionDB.requested;

    if (!sendEmailToAdmins) {
      // when approved or rejected, send to requested
      sendMailStatus({
        email: recipient.email,
        userName: recipient.name,
        reason: process.env.SOLUTION,
        name: solutionDB.name,
        resolution: solutionDB.status,
        url: process.env.URL_SOLUTION + solutionDB.id,
        reject_reason,
      });
    } else {
    }

    res.send(new Search(200, "Success", "Success", solutionDB));
  }

  async resendSolution(req, res) {
    const solutionId = req.params.id;

    const solution = {
      status: SOLUTION_STATUSES.REQUESTED,
    };

    await solutionServices.updateSolution(solutionId, solution);
    const solutionDB = await solutionServices.getOneSolution(solutionId);

    const recipients = await userServices.getUser(ROLES.ADMIN);
    recipients.forEach((recipient) => {
      sendMailReOpen({
        email: recipient.email,
        username: recipient.name,
        reason: process.env.SOLUTION + " " + solutionDB.name,
        resolution: SOLUTION_STATUSES.REQUESTED,
        url: process.env.URL_SOLUTION + solutionDB.id,
      });
    });
    res.send(new Search(200, "Success", "Success", solutionDB));
  }

  async deleteSolution(req, res) {
    let solutionId = req.params.id;
    await methodServices.deleteMethodBySolution(solutionId);
    await solutionFileServices.deleteSolutionFileBySolution(solutionId);
    const data = await solutionServices.deleteSolution(solutionId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
