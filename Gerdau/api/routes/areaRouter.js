import AreaSerivce from "../controllers/areaController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";

const areaServices = new AreaSerivce();

export default class AreaRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllAreas));
    this.router.get("/getAll/:plant", catchAsync(this.getAllAreasByPlant));
    this.router.get("/getOne/:name", catchAsync(this.getOneArea));
  }

  async getAllAreas(req, res) {
    const data = await areaServices.getAllAreas();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getAllAreasByPlant(req, res) {
    const plantId = req.params.plant;
    const data = await areaServices.getAllAreasByPlant(plantId);
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOneArea(req, res) {
    let nameArea = req.params.name;
    const data = await areaServices.getOneArea(nameArea);
    res.send(new Search(200, "Success", "Success", data));
  }
}
