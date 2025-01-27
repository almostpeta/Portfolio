import PlantSerivce from "../controllers/plantController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";

const plantServices = new PlantSerivce();

export default class PlantRouter {
  constructor() {
    this.router = Router();
    this.router.get("/getAll", catchAsync(this.getAllPlants));
    this.router.get("/getOne/:name", catchAsync(this.getOnePlant));
  }

  async getAllPlants(req, res) {
    const data = await plantServices.getAllPlants();
    res.send(new Search(200, "Success", "Success", data));
  }

  async getOnePlant(req, res) {
    let namePlant = req.params.name;
    const data = await plantServices.getOnePlant(namePlant);
    res.send(new Search(200, "Success", "Success", data));
  }
}
