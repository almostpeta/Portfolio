import PieceSerivce from "../controllers/pieceController.js";
import ComponentSerivce from "../controllers/componentController.js";
import StudyService from "../controllers/studyController.js";
import UserService from "../controllers/userController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import PieceFileService from "../controllers/pieceFileController.js";
import * as formidable from "formidable";
import upload from "../utils/uploadFile.js";

const pieceService = new PieceSerivce();
const componentService = new ComponentSerivce();
const userService = new UserService();
const pieceFileService = new PieceFileService();
const studyService = new StudyService();

export default class PieceRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllPieces));
    this.router.get(
      "/getAll/:component",
      catchAsync(this.getAllPiecesByComponent)
    );
    this.router.get("/getOne/id/:id", catchAsync(this.getOnePiece));
    this.router.get("/getOne/name/:name", catchAsync(this.getOnePieceByName));
    this.router.post(
      "/create",
      upload.array("files"),
      catchAsync(this.createPiece)
    );
    this.router.post("/bulk", catchAsync(this.bulkPiece));
    this.router.put(
      "/update",
      upload.array("files"),
      catchAsync(this.updatePiece)
    );
    this.router.delete("/delete/:id", catchAsync(this.deletePiece));
    this.router.put(
      "/deleteAll/:componentId",
      catchAsync(this.deleteAllPieceByComponent)
    );
    this.router.put("/addOrUpdateMany", catchAsync(this.addOrUpdateMany));
  }

  async getAllPieces(req, res) {
    const data = await pieceService.getAllPieces(
      Date.parse(req.query.startDate),
      Date.parse(req.query.endDate)
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllPiecesByComponent(req, res) {
    let componentId = req.params.component;
    const data = await pieceService.getAllPiecesByComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOnePiece(req, res) {
    let pieceId = req.params.id;
    const data = await pieceService.getOnePiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOnePieceByName(req, res) {
    let pieceName = req.params.name;
    const data = await pieceService.getOnePieceByName(pieceName);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createPiece(req, res) {
    let piece = {
      internal_name: req.body.internal_name,
      identifier: req.body.identifier,
      type: req.body.type,
      manufacturer: req.body.manufacturer,
      make: req.body.make || "",
      model: req.body.model || "",
      working_from_date: Date.parse(req.body.working_from_date),
      provider: req.body.provider || "",
      specifications: req.body.specifications || "",
      responsibleId: req.body.responsibleId || req.body.maintenance_responsible,
      manufacturer_type: req.body.manufacturer_type,
      componentId: req.body.componentId || req.body.component,
      electric_faults_count: parseInt(0),
      neumatic_faults_count: parseInt(0),
      hydraulic_faults_count: parseInt(0),
      mechanic_faults_count: parseInt(0),
      isActive: 1,
    };
    const data = await pieceService.createPiece(piece);
    console.log("\n\nfiles", req.files, "\n\n");
    await pieceFileService.uploadMany({
      files: req.files,
      pieceId: data.id,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async addOrUpdateMany(req, res) {
    let pieces = req.body.pieces;
    const data = await pieceService.addOrUpdateMany(pieces);
    res.send(new Search(200, "Success", "Success", data));
  }

  async updatePiece(req, res) {
    let dataList = [];
    let pieceId = req.body.id;

    // console.log(piece)
    let piece = {
      internal_name: req.body.internal_name,
      identifier: req.body.identifier,
      type: req.body.type,
      manufacturer: req.body.manufacturer,
      ...(req.body.make && { make: req.body.make }),
      ...(req.body.model && { model: req.body.model }),
      working_from_date: Date.parse(req.body.working_from_date),
      ...(req.body.provider && { provider: req.body.provider }),
      ...(req.body.specifications && {
        specifications: req.body.specifications,
      }),
      responsibleId: req.body.responsibleId || req.body.maintenance_responsible,
      manufacturer_type: req.body.manufacturer_type,
      componentId: req.body.componentId || req.body.component,
      // ...(req.body.electric_faults_count && {
      //   electric_faults_count: parseInt(req.body.electric_faults_count + 1),
      // }),
      // ...(req.body.neumatic_faults_count && {
      //   neumatic_faults_count: parseInt(req.body.neumatic_faults_count + 1),
      // }),
      // ...(req.body.hydraulic_faults_count && {
      //   hydraulic_faults_count: parseInt(req.body.hydraulic_faults_count + 1),
      // }),
      // ...(req.body.mechanic_faults_count && {
      //   mechanic_faults_count: parseInt(req.body.mechanic_faults_count + 1),
      // }),
      isActive: 1,
    };
    // si existe, update, agrego archivo o elimino
    if (pieceId) {
      const data = await pieceService.updatePiece(pieceId, piece);
      dataList.push(data);

      await pieceFileService.uploadMany({
        files: req.files,
        pieceId: pieceId,
      });

      let deleteFiles = req.body.deleteFiles;

      if (typeof deleteFiles === "string") {
        deleteFiles = [+deleteFiles];
      }
      if (deleteFiles) {
        await pieceFileService.deletePieceFiles(deleteFiles);
      }
      // si no existe creo
    } else {
      const data = await pieceService.createPiece(piece);
      await pieceFileService.uploadMany({
        files: req.files,
        pieceId: data.id,
      });
    }
    res.send(new Search(200, "Success", "Success", dataList));
  }

  async deletePiece(req, res) {
    let pieceId = req.params.id;
    studyService.deleteAllstudiesByPiece(pieceId);
    pieceFileService.deleteAllFilesByPiece(pieceId);
    const data = await pieceService.deletePiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteAllPieceByComponent(req, res) {
    let componentId = req.params.componentId;
    const data = await pieceService.deleteAllPieceByComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
