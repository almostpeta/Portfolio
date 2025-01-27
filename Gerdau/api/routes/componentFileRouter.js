import ComponentFileService from "../controllers/componentFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import path from "path";

const componentFileService = new ComponentFileService();

export default class ComponentFileRouter {
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
      "/getFileNamesFromComponent/id/:id",
      catchAsync(this.getFileNamesFromComponent)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
    this.router.get(
      "/getFileFromComponent/id/:id",
      catchAsync(this.getFileFromComponent)
    );
  }

  async uploadFiles(req, res) {
    const data = await componentFileService.uploadFile({
      file: req.file.path,
      componentId: req.body.componentId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromComponent(req, res) {
    let componentId = req.params.id;
    const data = await componentFileService.getFileFromComponent(componentId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromComponent(req, res) {
    let componentId = req.params.id;
    const data = await componentFileService.getFileNamesFromComponent(
      componentId
    );
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let componentFileId = req.params.id;
    const data = await componentFileService.getFileFromId(componentFileId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadMany(req, res) {
    const data = await componentFileService.uploadMany({
      files: req.files,
      componentId: req.body.componentId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }
}
