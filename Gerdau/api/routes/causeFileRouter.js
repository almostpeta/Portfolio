import CauseFileService from "../controllers/causeFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import path from "path";

const causeFileService = new CauseFileService();

export default class CauseFileRouter {
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
      "/getFileNamesFromCause/id/:id",
      catchAsync(this.getFileNamesFromCause)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
    this.router.get(
      "/getFileFromCause/id/:id",
      catchAsync(this.getFileFromCause)
    );
  }

  async uploadFiles(req, res) {
    const data = await causeFileService.uploadFile({
      file: req.file.path,
      causeId: req.body.causeId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromCause(req, res) {
    let causetId = req.params.id;
    const data = await causeFileService.getFileFromCause(causeId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromCause(req, res) {
    let causeId = req.params.id;
    const data = await causeFileService.getFileNamesFromCause(causeId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let causeFileId = req.params.id;
    const data = await causeFileService.getFileFromId(causeFileId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadMany(req, res) {
    const data = await causeFileService.uploadMany({
      files: req.files,
      causeId: req.body.causeId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }
}
