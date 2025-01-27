import MethodServices from "../controllers/methodController.js";
import UserServices from "../controllers/userController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import upload from "../utils/uploadFile.js";
import { sendMailReOpen, sendMailStatus } from "../utils/sendMail.js";
import MethodFileService from "../controllers/methodFileController.js";
import { adminOnly, forbiddenForOperator } from "../utils/verifyToken.js";

const userServices = new UserServices();
const methodServices = new MethodServices();
const methodFileServices = new MethodFileService();

export default class MethodRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllMethods));
    this.router.get("/getOne/:id", catchAsync(this.getOneMethod));
    this.router.post(
      "/create",
      [forbiddenForOperator, upload.any()],
      catchAsync(this.createMethod)
    );
    this.router.put(
      "/update/:id",
      [forbiddenForOperator, upload.any()],
      catchAsync(this.updateMethod)
    );
    this.router.delete(
      "/delete/:id",
      [adminOnly, upload.any()],
      catchAsync(this.deleteMethod)
    );
  }

  async getAllMethods(req, res) {
    const data = await methodServices.getAllMethod();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneMethod(req, res) {
    let methodId = req.params.id;
    const data = await methodServices.getOneMethod(methodId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async createMethod(req, res) {
    const method = {
      ...req.body,
      isActive: 1,
    };
    const data = await methodServices.createMethod(method);

    await methodFileServices.uploadMany({
      files: req.files,
      methodId: data.id,
    });

    res.send(new Search(200, "Success", "Success", data));
  }

  async updateMethod(req, res) {
    const methodId = req.params.id;
    const method = {
      ...req.body,
      isActive: 1,
    };
    const data = await methodServices.updateMethod(methodId, method);

    await methodFileServices.uploadMany({
      files: req.files,
      methodId: methodId,
    });
    const deleteFiles = req.body.deleteFiles;
    if (deleteFiles) {
      deleteFiles.forEach(async (fileId) => {
        await methodFileServices.deleteMethodFile(fileId);
      });
    }

    res.send(new Search(200, "Success", "Success", data));
  }

  async deleteMethod(req, res) {
    let methodId = req.params.id;
    await methodFileServices.deleteMethodFileByMethod(methodId);
    const data = await methodServices.deleteMethod(methodId);
    res.send(new Search(200, "Success", "Success", data));
  }
}
