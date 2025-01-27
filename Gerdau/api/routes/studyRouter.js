import StudySerivce from "../controllers/studyController.js";
import StudyFileSerivce from "../controllers/studyFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import { forbiddenForOperator } from "../utils/verifyToken";

const studyServices = new StudySerivce();
const studyFileServices = new StudyFileSerivce();

export default class StudyRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllStudies));
    this.router.get(
      "/getAll/component/:component",
      catchAsync(this.getAllStudysByComponent)
    );
    this.router.get(
      "/getAll/piece/:piece",
      catchAsync(this.getAllStudysByPiece)
    );
    this.router.get("/getOne/:study", catchAsync(this.getOneStudy));
    this.router.post(
      "/create",
      [forbiddenForOperator, upload.array("files")],
      catchAsync(this.createStudy)
    );
    this.router.put(
      "/update/:study",
      [forbiddenForOperator, upload.array("files")],
      catchAsync(this.updateStudy)
    );
    this.router.put(
      "/delete/:study",
      [forbiddenForOperator],
      catchAsync(this.deleteStudy)
    );
  }

  async getAllStudies(req, res) {
    const data = await studyServices.getAllStudies();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllStudysByComponent(req, res) {
    const componentId = req.params.component;
    const data = await studyServices.getAllStudysByComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllStudysByPiece(req, res) {
    const pieceId = req.params.piece;
    const data = await studyServices.getAllStudysByPiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneStudy(req, res) {
    const studyId = req.params.study;
    const data = await studyServices.getOneStudy(studyId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createStudy(req, res) {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    const study = {
      internal_name: req.body.internal_name,
      reason: req.body.reason,
      userId: req.body.userId,
      //toDo: change the following lines to support null values
      componentId:
        req.body.componentId == "null" || req.body.componentId == null
          ? null
          : req.body.componentId,
      pieceId:
        req.body.pieceId == "null" || req.body.pieceId == null
          ? null
          : req.body.pieceId,
      date: Date.parse(req.body.date),
      isActive: 1,
    };
    const data = await studyServices.createStudy(study);
    await studyFileServices.uploadMany({
      files: req.files,
      studyId: data.id,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async updateStudy(req, res) {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    const studyId = req.params.study;
    const study = {
      ...(req.body.internal_name && { internal_name: req.body.internal_name }),
      ...(req.body.reason && { reason: req.body.reason }),
      ...(req.body.userId && { userId: req.body.userId }),
      //toDo: change the following lines to support null values
      componentId:
        req.body.componentId == "null" || req.body.componentId == null
          ? null
          : req.body.componentId,
      pieceId:
        req.body.pieceId == "null" || req.body.pieceId == null
          ? null
          : req.body.pieceId,
      ...(req.body.date && { date: Date.parse(req.body.date) }),
      isActive: 1,
    };
    const data = await studyServices.updateStudy(studyId, study);
    await studyFileServices.uploadMany({
      files: req.files,
      studyId: studyId,
    });
    const deleteFiles = req.body.deleteFiles;
    if (deleteFiles) {
      deleteFiles.forEach(async (fileId) => {
        await studyFileServices.deleteStudyFile(fileId);
      });
    }
    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteStudy(req, res) {
    const studyId = req.params.study;
    const data = await studyServices.deleteStudy(studyId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
