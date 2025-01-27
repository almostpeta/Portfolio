import MethodFileService from "../controllers/methodFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";

const methodFileService = new MethodFileService();

export default class MethodFileRouter {
  constructor() {
    this.router = Router();
    this.router.post(
      "/upload",
      upload.single("file"),
      catchAsync(this.uploadFile)
    );
    this.router.get(
      "/getFileNamesFromMethod/id/:id",
      catchAsync(this.getFileNamesFromMethod)
    );
    this.router.get(
      "/getFileFromMethod/id/:id",
      catchAsync(this.getFileFromMethod)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
  }

  async uploadFile(req, res) {
    const data = await methodFileService.uploadFile(req);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromMethod(req, res) {
    let methodId = req.params.id;
    const data = await methodFileService.getFileNamesFromMethod(methodId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromMethod(req, res) {
    let methodId = req.params.id;
    const data = await methodFileService.getFileFromMethod(methodId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let methodFileId = req.params.id;
    const data = await methodFileService.getFileFromId(methodFileId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
