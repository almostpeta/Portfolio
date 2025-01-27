import UserSerivce from "../controllers/userController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import { verifyToken } from "../utils/verifyToken.js";
import bcrypt from "bcryptjs";
import upload from "../utils/uploadFile.js";

const userServices = new UserSerivce();

export default class UserRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", verifyToken, catchAsync(this.getAllUsers));
    this.router.get("/getOne/:email", verifyToken, catchAsync(this.getOneUser));
    this.router.get(
      "/getOne/id/:id",
      verifyToken,
      catchAsync(this.getOneUserById)
    );
    this.router.post(
      "/register",
      upload.array("files"),
      catchAsync(this.register)
    );
    this.router.get("/me", verifyToken, catchAsync(this.me));
    this.router.post("/login", upload.array("files"), catchAsync(this.login));
    this.router.post(
      "/changePassword",
      upload.array("files"),
      catchAsync(this.changePassword)
    );
    this.router.post(
      "/disableUser",
      upload.array("files"),
      catchAsync(this.disableUser)
    );
    this.router.post(
      "/enableUser",
      upload.array("files"),
      catchAsync(this.enableUser)
    );
    this.router.put(
      "/update/:id",
      upload.array("files"),
      catchAsync(this.editUser)
    );
  }

  async getAllUsers(req, res) {
    const data = await userServices.getAllUsers(req, res);
    res.send(new Search(200, "Success", "Success", data));
  }

  async disableUser(req, res) {
    await userServices.disableUser({ ...req.body });
    res.send(new Search(200, "Success", "Success", {}));
  }

  async enableUser(req, res) {
    await userServices.enableUser({ ...req.body });
    res.send(new Search(200, "Success", "Success", {}));
  }

  async getOneUser(req, res) {
    const email = req.params.email;
    const data = await userServices.getOneUser(email);
    res.send(new Search(200, "Success", "Success", data));
  }

  async register(req, res) {
    const data = await userServices.register(req.body);
    res.send(new Search(200, "Success", "Success", data));
  }

  async me(req, res) {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });

    const data = await userServices.me(res, token);
  }

  async login(req, res) {
    const user = { ...req.body };
    const data = await userServices.login(res, user);
  }

  async changePassword(req, res) {
    const user = { ...req.body };
    await userServices.changePassword(res, user);
  }

  async getOneUserById(req, res) {
    const userId = req.params.id;
    const user = await userServices.getOneUserId(userId);
    res.send(new Search(200, "Success", "Success", user));
  }

  async editUser(req, res) {
    const userId = req.params.id;
    const user = { ...req.body, id: userId };
    const editedUser = await userServices.editUser(user);
    res.send(new Search(200, "Success", "Success", editedUser));
  }
}
