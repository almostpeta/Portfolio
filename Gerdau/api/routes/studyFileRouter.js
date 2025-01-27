import StudyFileService from "../controllers/studyFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";

const studyFileService = new StudyFileService();

export default class StudyFileRouter {
  constructor() {
    this.router = Router();
    this.router.post(
      "/upload",
      upload.single("file"),
      catchAsync(this.uploadFiles)
    );
    this.router.post(
      "/uploadMany",
      upload.array("file"),
      catchAsync(this.uploadMany)
    );
    this.router.get(
      "/getFileNamesFromStudy/id/:id",
      catchAsync(this.getFileNamesFromStudy)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
    this.router.get(
      "/getFileFromStudy/id/:id",
      catchAsync(this.getFileFromStudy)
    );
  }

  async uploadFiles(req, res) {
    const data = await studyFileService.uploadFile({
      file: req.file.path,
      studyId: req.body.studyId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromStudy(req, res) {
    let studyId = req.params.id;
    const data = await studyFileService.getFileNamesFromStudy(studyId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let studyFileId = req.params.id;
    const data = await studyFileService.getFileFromId(studyFileId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadMany(req, res) {
    const data = await studyFileService.uploadMany({
      files: req.files,
      studyId: req.body.studyId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromStudy(req, res) {
    let studyId = req.params.id;
    const data = await studyFileService.getFileFromStudy(studyId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
