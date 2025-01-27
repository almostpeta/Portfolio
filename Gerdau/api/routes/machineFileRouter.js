import MachineFileService from "../controllers/machineFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import path from "path";

const machineFileService = new MachineFileService();

export default class MachineFileRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllMachines));
    this.router.post(
      "/uploadMany",
      upload.array("file"),
      catchAsync(this.uploadMany)
    );
    this.router.post(
      "/upload",
      upload.array("file"),
      catchAsync(this.uploadFiles)
    );
    this.router.get(
      "/getFileNamesFromMachine/id/:id",
      catchAsync(this.getFileNamesFromMachine)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
    this.router.get(
      "/getFileFromMachine/id/:id",
      catchAsync(this.getFileFromMachine)
    );
  }

  async getFileNamesFromMachine(req, res) {
    let machineId = req.params.id;
    const data = await machineFileService.getFileNamesFromMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromMachine(req, res) {
    let machineId = req.params.id;
    const data = await machineFileService.getFileFromMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let machineFileId = req.params.id;
    const data = await machineFileService.getFileFromId(machineFileId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllMachines(req, res) {
    const data = await machineFileService.getAllMachines();
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadFiles(req, res) {
    const data = await machineFileService.uploadFile({
      file: req.files[0].path,
      machineId: req.body.machineId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadMany(req, res) {
    const data = await machineFileService.uploadMany({
      files: req.files,
      machineId: req.body.machineId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }
}
