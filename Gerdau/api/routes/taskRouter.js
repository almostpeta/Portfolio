import TaskSerivces from "../controllers/taskController.js";
import UserServices from "../controllers/userController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import { ROLES } from "../utils/constants";
import { sendMail, sendMailReOpen } from "../utils/sendMail.js";
import { adminOnly } from "../utils/verifyToken.js";

const taskServices = new TaskSerivces();
const userServices = new UserServices();
let logger = null;

export default class TaskRouter {
  constructor(deps) {
    logger = deps.logger.child({ service: "Tasks" });
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllTasks));
    this.router.get("/getOne/:id", catchAsync(this.getOneTask));
    this.router.get("/getTasksByUser/:value", catchAsync(this.getTasksByUser));
    this.router.get(
      "/getTasksByMachine/:machine",
      catchAsync(this.getTasksByMachine)
    );
    this.router.get(
      "/getTasksByComponent/:component",
      catchAsync(this.getTasksByComponent)
    );
    this.router.get(
      "/getTasksByPiece/:piece",
      catchAsync(this.getTasksByPiece)
    );
    this.router.post(
      "/create",
      [adminOnly, upload.any()],
      catchAsync(this.createTask)
    );
    this.router.post(
      "/:id/completeTask",
      upload.any(),
      catchAsync(this.setTaskAsCompleted)
    );
    this.router.put("/update/:id", upload.any(), catchAsync(this.updateTask));
    this.router.delete(
      "/delete/:id",
      upload.any(),
      catchAsync(this.deleteTask)
    );
  }

  async getAllTasks(req, res) {
    // only admins can search for responsibleid,
    // other users only sees assigned to them
    let responsibleId =
      req.user.role === ROLES.ADMIN ? req.body.responsibleId : req.user.id;

    const data = await taskServices.getAllTasks(
      responsibleId,
      req.query.endDate,
      req.query.startDate,
      req.query.machineId,
      req.query.status
    );

    logger.debug(`Found ${data.length} tasks`);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneTask(req, res) {
    const taskId = req.params.id;
    const responsibleId = req.user.role !== ROLES.ADMIN ? req.user.id : null;
    const data = await taskServices.getOneTask(taskId, responsibleId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getTasksByUser(req, res) {
    let value = req.params.value;
    const data = await taskServices.getTasksByUser(value);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getTasksByMachine(req, res) {
    let machineId = req.params.machine;
    const data = await taskServices.getTasksByMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getTasksByComponent(req, res) {
    let componentId = req.params.component;
    const data = await taskServices.getTasksByComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getTasksByPiece(req, res) {
    let pieceId = req.params.piece;
    const data = await taskServices.getTasksByPiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createTask(req, res) {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    const task = {
      name: req.body.name,
      description: req.body.description,
      reason: req.body.reason,
      responsibleId: req.body.responsibleId,
      requestedId: req.body.requestedId,
      deadline: Date.parse(req.body.deadline),
      start_date: req.body.start_date || null,
      completed_date: req.body.completed_date || null,
      ...(req.body.machineId && {
        machineId: parseInt(req.body.machineId) || null,
      }),
      ...(req.body.componentId && {
        componentId: parseInt(req.body.componentId) || null,
      }),
      ...(req.body.pieceId && {
        pieceId: parseInt(req.body.pieceId) || null,
      }),
      isActive: 1,
      status: req.body.status,
    };

    const data = await taskServices.createTask(task);

    const responsible = await userServices.getOneUserId(req.body.responsibleId);
    sendMail({
      email: responsible.email,
      username: responsible.name,
      reason: process.env.TASK,
      url: process.env.URL_TASK + data.id,
    });
    const requested = await userServices.getOneUserId(req.body.requestedId);
    sendMail({
      email: requested.email,
      username: requested.name,
      reason: process.env.TASK,
      url: process.env.URL_TASK + data.id,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateTask(req, res) {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    const taskId = req.params.id;
    const task = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.reason && { reason: req.body.reason }),
      ...(req.body.start_date && { start_date: req.body.start_date }),
      ...(req.body.responsibleId && {
        responsibleId: req.body.responsibleId,
      }),
      ...(req.body.requestedId && {
        requestedId: req.body.requestedId,
      }),
      ...(req.body.deadline && { deadline: req.body.deadline }),
      ...(req.body.completed_date && {
        completed_date: req.body.completed_date,
      }),
      ...(req.body.machineId && {
        machineId: parseInt(req.body.machineId) || null,
      }),
      ...(req.body.componentId && {
        componentId: parseInt(req.body.componentId) || null,
      }),
      ...(req.body.pieceId && {
        pieceId: parseInt(req.body.pieceId) || null,
      }),
      isActive: 1,
      ...(req.body.status && { status: req.body.status }),
    };

    const data = await taskServices.updateTask(taskId, task);

    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteTask(req, res) {
    const taskId = req.params.id;
    const data = await taskServices.deleteTask(taskId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async setTaskAsCompleted(req, res) {
    const taskId = req.params.id;
    const response = await taskServices.setTaskAsCompleted(taskId);
    res.send(new Search(200, "Success", "Success", response));
  }
}
