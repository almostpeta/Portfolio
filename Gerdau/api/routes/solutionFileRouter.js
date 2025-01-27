import SolutionFileService from "../controllers/solutionFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";

const solutionFileService = new SolutionFileService();

export default class SolutionFileRouter {
  constructor() {
    this.router = Router();
    this.router.post(
      "/upload",
      upload.single("file"),
      catchAsync(this.uploadFile)
    );
    this.router.get(
      "/getFileNamesFromSolution/id/:id",
      catchAsync(this.getFileNamesFromSolution)
    );
    this.router.get(
      "/getFileFromSolution/id/:id",
      catchAsync(this.getFileFromSolution)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
  }

  async uploadFile(req, res) {
    console.log(req.body);
    const data = await solutionFileService.uploadFile(req);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromSolution(req, res) {
    let solutionId = req.params.id;
    const data = await solutionFileService.getFileNamesFromSolution(solutionId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromSolution(req, res) {
    let solutionId = req.params.id;
    const data = await solutionFileService.getFileFromSolution(solutionId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let solutionFileId = req.params.id;
    const data = await solutionFileService.getFileFromId(solutionFileId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
