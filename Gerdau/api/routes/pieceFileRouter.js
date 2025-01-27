import PieceFileService from "../controllers/pieceFileController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";

const pieceFileService = new PieceFileService();

export default class PieceFileRouter {
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
      "/getFileNamesFromPiece/id/:id",
      catchAsync(this.getFileNamesFromPiece)
    );
    this.router.get("/getFileFromId/id/:id", catchAsync(this.getFileFromId));
    this.router.get(
      "/getFileFromPiece/id/:id",
      catchAsync(this.getFileFromPiece)
    );
  }

  async uploadFiles(req, res) {
    const data = await pieceFileService.uploadFile({
      file: req.file.path,
      pieceId: req.body.pieceId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileNamesFromPiece(req, res) {
    let pieceId = req.params.id;
    const data = await pieceFileService.getFileNamesFromPiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromId(req, res) {
    let pieceFileId = req.params.id;
    const data = await pieceFileService.getFileFromId(pieceFileId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async uploadMany(req, res) {
    const data = await pieceFileService.uploadMany({
      files: req.files,
      pieceId: req.body.pieceId,
    });
    res.send(new Search(200, "Success", "Success", data));
  }

  async getFileFromPiece(req, res) {
    let pieceId = req.params.id;
    const data = await pieceFileService.getFileFromPiece(pieceId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
