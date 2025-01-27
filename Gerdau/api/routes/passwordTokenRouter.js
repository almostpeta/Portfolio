import upload from "../utils/uploadFile.js";
import { Router } from "express";
import PasswordTokenController from "../controllers/passwordTokenController.js";
import { catchAsync, Search } from "../utils/utils.js";

const controller = new PasswordTokenController();

export default class PasswordTokenRouter {
  constructor() {
    this.router = Router();
    this.router.post(
      "/create",
      upload.array("files"),
      catchAsync(this.createPasswordToken)
    );
  }

  async createPasswordToken(req, res) {
    console.log(req.body);
    const email = req.body.email;
    await controller.createForgetPasswordToken(email);
    res.send(new Search(200, "Success", "Success", {}));
  }
}
