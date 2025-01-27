import FaultFileService from "../controllers/faultFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";

const faultFileService = new FaultFileService();

export default class FaultFileRouter {
  constructor() {
    this.router = Router();
    this.router.post(
      "/upload",
      upload.single("file"),
      catchAsync(this.uploadFile)
    );
    this.router.get(
      "/getFileNamesFromFault/id/:id",
      catchAsync(this.getFileNamesFromFault)
    );
    this.router.get(
      "/getFileFromFault/id/:id",
      catchAsync(this.getFileFromFault)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
  }

  async uploadFile(req, res) {
    console.log(req.body);
    const data = await faultFileService.uploadFile(req);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromFault(req, res) {
    let faultId = req.params.id;
    const data = await faultFileService.getFileNamesFromFault(faultId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromFault(req, res) {
    let faultId = req.params.id;
    const data = await faultFileService.getFileFromFault(faultId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let faultFileId = req.params.id;
    const data = await faultFileService.getFileFromId(faultFileId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
