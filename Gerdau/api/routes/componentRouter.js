import ComponentService from "../controllers/componentController.js";
import MachineService from "../controllers/machineController.js";
import UserService from "../controllers/userController.js";
import PieceService from "../controllers/pieceController.js";
import StudyService from "../controllers/studyController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import ComponentFileService from "../controllers/componentFileController.js";
import * as formidable from "formidable";
import upload from "../utils/uploadFile.js";

const componentService = new ComponentService();
const machineService = new MachineService();
const pieceService = new PieceService();
const componentFileService = new ComponentFileService();
const studyService = new StudyService();

export default class ComponentRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllComponents));
    this.router.get(
      "/getAll/:machine",
      catchAsync(this.getAllComponentsByMachine)
    );
    this.router.get("/getOne/id/:id", catchAsync(this.getOneComponent));
    this.router.get(
      "/getOne/name/:name",
      catchAsync(this.getOneComponentByName)
    );
    this.router.post(
      "/create",
      upload.array("files"),
      catchAsync(this.createComponent)
    );
    this.router.post(
      "/bulk",
      upload.array("files"),
      catchAsync(this.bulkComponent)
    );
    this.router.put(
      "/update",
      upload.array("files"),
      catchAsync(this.updateComponent)
    );
    this.router.put(
      "/addOrUpdateMany",
      catchAsync(this.addOrUpdateMany),
      upload.array("files")
    );
    this.router.delete("/delete/:id", catchAsync(this.deleteComponent));
    this.router.put(
      "/deleteAll/:machineId",
      catchAsync(this.deleteAllComponentsByMachine)
    );
  }

  async getAllComponents(req, res) {
    const data = await componentService.getAllComponents(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllComponentsByMachine(req, res) {
    let machineId = req.params.machine;
    const data = await componentService.getAllComponentsByMachine(machineId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneComponent(req, res) {
    let componentId = req.params.id;
    const data = await componentService.getOneComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneComponentByName(req, res) {
    let componentName = req.params.name;
    const data = await componentService.getOneComponentByName(componentName);
    res.send(new Search(200, "Success", "Success", data));
  }
  async createComponent(req, res) {
    let component = {
      internal_name: req.body.internal_name,
      serie_number: req.body.serie_number,
      type: req.body.type,
      manufacturer: req.body.manufacturer,
      make: req.body.make || "",
      model: req.body.model || "",
      working_from_date: Date.parse(req.body.working_from_date),
      provider: req.body.provider || "",
      description: req.body.description || "",
      relevant_data: req.body.relevant_data || "",
      manufacturer_type: req.body.manufacturer_type,
      machineId: req.body.machineId || req.body.machine,
      responsibleId: req.body.responsibleId || req.body.maintenance_responsible,
      state: req.body.state,
      electric_faults_count: parseInt(0),
      neumatic_faults_count: parseInt(0),
      hydraulic_faults_count: parseInt(0),
      mechanic_faults_count: parseInt(0),
      isActive: 1,
    };
    const data = await componentService.createComponent(component);

    await componentFileService.uploadMany({
      files: req.files,
      componentId: data.id,
    });

    res.send(new Search(200, "Success", "Success", data));
  }
  async addOrUpdateMany(req, res) {
    let components = req.body.components;
    const data = await componentService.addOrUpdateMany(components);
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateComponent(req, res) {
    let dataList = [];
    const componentId = req.body.id;
    let component = {
      id: req.body.id,
      internal_name: req.body.internal_name,
      serie_number: req.body.serie_number,
      type: req.body.type,
      manufacturer: req.body.manufacturer,
      ...(req.body.make && { make: req.body.make }),
      ...(req.body.model && { model: req.body.model }),
      working_from_date: Date.parse(req.body.working_from_date),
      ...(req.body.provider && { provider: req.body.provider }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.relevant_data && { relevant_data: req.body.relevant_data }),
      manufacturer_type: req.body.manufacturer_type,
      ...(req.body.machine && { machineId: req.body.machine }),
      responsibleId: req.body.responsibleId || req.body.maintenance_responsible,
      state: req.body.state,
      machineId: req.body.machineId || req.body.machine,
      isActive: 1,
    };

    // si existe, update Componente, puede ingresar mas archivos o eliminarlo
    if (componentId) {
      const data = await componentService.updateComponent(
        componentId,
        component
      );
      dataList.push(data);
      await componentFileService.uploadMany({
        files: req.files,
        componentId: componentId,
      });

      let deleteFiles = req.body.deleteFiles;

      if (typeof deleteFiles === "string") {
        deleteFiles = [+deleteFiles];
      }
      if (deleteFiles) {
        await componentFileService.deleteComponentFiles(deleteFiles);
      }
      //si no existe, crea el componente
    } else {
      const data = await componentService.createComponent(component);
      dataList.push(data);
      await componentFileService.uploadMany({
        files: req.files,
        componentId: data.id,
      });
    }

    res.send(new Search(200, "Success", "Success", dataList));
  }

  async deleteComponent(req, res) {
    let componentId = req.params.id;
    pieceService.deleteAllPieceByComponent(componentId);
    studyService.deleteAllstudiesByComponent(componentId);
    componentFileService.deleteAllFilesByComponent(componentId);
    const data = await componentService.deleteComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteAllComponentsByMachine(req, res) {
    let machineId = req.params.machineId;
    const list = await componentService.getAllComponentsByMachine(machineId);
    list.forEach(async (component) => {
      await pieceService.deleteAllPieceByComponent(component.id);
    });
    const data = await componentService.deleteAllComponentsByMachine(machineId);
  }
}
