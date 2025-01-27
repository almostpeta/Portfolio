import SublevelSerivce from "../controllers/sublevelController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";

const sublevelServices = new SublevelSerivce();

export default class SublevelRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllSublevels));
    this.router.get("/getAll/:area", catchAsync(this.getAllSublevelsByArea));
    this.router.get("/getOne/:name", catchAsync(this.getOneSublevel));
  }

  async getAllSublevels(req, res) {
    const data = await sublevelServices.getAllSublevels();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllSublevelsByArea(req, res) {
    const areaId = req.params.area;
    const data = await sublevelServices.getAllSublevelsByArea(areaId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneSublevel(req, res) {
    let nameSublevel = req.params.name;
    const data = await sublevelServices.getOneSublevel(nameSublevel);
    res.send(new Search(200, "Success", "Success", data));
  }
}
