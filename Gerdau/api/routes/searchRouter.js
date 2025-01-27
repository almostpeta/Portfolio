import SearchSerivce from "../controllers/searchController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";

const searchServices = new SearchSerivce();

export default class SearchRouter {
  constructor() {
    this.router = Router();
    this.router.get("", catchAsync(this.getAllSearch));
  }

  async getAllSearch(req, res) {
    const filterBy = req.query.filterBy;
    const value = req.query.value;
    const data = await searchServices.getAllSearch(
      filterBy.toLowerCase(),
      value
    );
    console.log(data);
    res.send(new Search(200, "Success", "Success", data));
  }
}
