import MachineStageController from "../controllers/machineStageController";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";

const machineStageController = new MachineStageController();

export default class MachineStageRouter {
  constructor() {
    this.router = Router();
    this.router.get("/", catchAsync(this.getAllStages));
    this.router.get("/:machineId", catchAsync(this.getAllFromMachine));
  }

  async getAllStages(req, res) {
    const data = await machineStageController.getAllStages();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllFromMachine(req, res) {
    const machineId = req.params.machineId;
    const data = await machineStageController.getMachineStages(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
