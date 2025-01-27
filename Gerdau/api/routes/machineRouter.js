import MachineService from "../controllers/machineController.js";
import Component from "./componentRouter.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import formidable from "formidable";
import upload from "../utils/uploadFile.js";
import MachineFileService from "../controllers/machineFileController.js";

const machineService = new MachineService();
const machineFileService = new MachineFileService();
const component = new Component();
let logger = null;

export default class MachineRouter {
  constructor(deps) {
    logger = deps.logger.child({ service: "machine" });
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllMachines));
    this.router.get("/getOne/id/:id", catchAsync(this.getOneMachine));
    this.router.get("/getOne/name/:name", catchAsync(this.getOneMachineByName));
    this.router.post(
      "/create",
      upload.array("files"),
      catchAsync(this.createMachine)
    );
    this.router.put(
      "/update/:id",
      upload.array("files"),
      catchAsync(this.updateMachine)
    );
    this.router.delete("/delete/:machineId", catchAsync(this.deleteMachine));
  }

  async getAllMachines(req, res) {
    const data = await machineService.getAllMachines(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );

    logger.debug(`Found ${data.length} machines`);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneMachine(req, res) {
    let machineId = req.params.id;
    const data = await machineService.getOneMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneMachineByName(req, res) {
    let machineName = req.params.name;
    const data = await machineService.getOneMachineByName(machineName);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createMachine(req, res) {
    let machine = {
      internal_name: req.body.internal_name,
      serie_number: req.body.serie_number,
      type: req.body.type,
      manufacturer: req.body.manufacturer,
      make: req.body.make || "",
      model: req.body.model || "",
      working_from_date: Date.parse(req.body.working_from_date),
      purchase_number: req.body.purchase_number,
      responsibleId: req.body.maintenance_responsible,
      description: req.body.description || "",
      relevant_data: req.body.relevant_data || "",
      manufacturer_type: req.body.manufacturer_type,
      flat_number: req.body.flat_number || "",
      state: req.body.state,
      electric_faults_count: parseInt(0),
      neumatic_faults_count: parseInt(0),
      hydraulic_faults_count: parseInt(0),
      mechanic_faults_count: parseInt(0),
      plantId: req.body.plant,
      areaId: req.body.area,
      sublevelId: req.body.sublevel,
      total_stopped_machine_time: parseInt(0),
      isActive: 1,
    };
    const stageIds = JSON.parse(req.body.stages);
    const data = await machineService.createMachine(machine, stageIds);
    await machineFileService.uploadMany({
      files: req.files,
      machineId: data.id,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateMachine(req, res) {
    try {
      let machineId = req.params.id;
      let machine = {
        ...(req.body.internal_name && {
          internal_name: req.body.internal_name,
        }),
        ...(req.body.serie_number && { serie_number: req.body.serie_number }),
        ...(req.body.type && { type: req.body.type }),
        ...(req.body.manufacturer && { manufacturer: req.body.manufacturer }),
        ...(req.body.make && { make: req.body.make }),
        ...(req.body.model && { model: req.body.model }),
        ...(req.body.working_from_date && {
          working_from_date: Date.parse(req.body.working_from_date),
        }),
        ...(req.body.purchase_number && {
          purchase_number: req.body.purchase_number,
        }),
        ...(req.body.responsible && { responsibleId: req.user.id }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.isActive && { isActive: req.body.isActive }),
        ...(req.body.relevant_data && {
          relevant_data: req.body.relevant_data,
        }),
        ...(req.body.manufacturer_type && {
          manufacturer_type: req.body.manufacturer_type,
        }),
        ...(req.body.flat_number && { flat_number: req.body.flat_number }),
        ...(req.body.state && { state: req.body.state }),
        ...(req.body.electric_faults_count && {
          electric_faults_count: parseInt(req.body.electric_faults_count),
        }),
        ...(req.body.neumatic_faults_count && {
          neumatic_faults_count: parseInt(req.body.neumatic_faults_count),
        }),
        ...(req.body.hydraulic_faults_count && {
          hydraulic_faults_count: parseInt(req.body.hydraulic_faults_count),
        }),
        ...(req.body.mechanic_faults_count && {
          mechanic_faults_count: parseInt(req.body.mechanic_faults_count),
        }),
        ...(req.body.plant && { plantId: req.body.plant }),
        ...(req.body.area && { areaId: req.body.area }),
        ...(req.body.sublevel && { sublevelId: req.body.sublevel }),
      };
      let stageIds = null;
      if (req.body.stages) {
        stageIds = JSON.parse(req.body.stages);
      }
      const data = await machineService.updateMachine(
        machineId,
        machine,
        stageIds
      );
      await machineFileService.uploadMany({
        files: req.files,
        machineId: machineId,
      });
      const deleteFiles = req.body.deleteFiles;
      if (deleteFiles) {
        deleteFiles.forEach(async (fileId) => {
          await machineFileService.deleteMachineFile(fileId);
        });
      }
      res.send(new Search(200, "Success", "Success", data));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteMachine(req, res) {
    let machineId = req.params.machineId;
    await component.deleteAllComponentsByMachine(req, res);
    await machineFileService.deleteAllFilesByMachines(req.params.machineId);
    const data = await machineService.deleteMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
