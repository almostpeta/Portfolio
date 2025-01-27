import { Router } from "express";
import sequelize from "../db/dbconection.js";
import { reportError } from "../utils/sendMail.js";
import { catchAsync, Search } from "../utils/utils.js";
import { SUPPORT_EMAIL } from "../utils/constants";
import upload from "../utils/uploadFile";

const models = sequelize.models;
const User = models.user;

export default class ErrorRouter {
  constructor() {
    this.router = Router();
    this.router.post("/", upload.any(), catchAsync(this.logError));
  }

  async logError(req, res) {
    const user = await User.findOne({ where: { id: req.user.id } });
    await reportError({
      to: SUPPORT_EMAIL,
      reporter: user?.name,
      body: JSON.stringify(req.body),
    });
    res.send(new Search(200, "Success", "Success", { success: true }));
  }
}
