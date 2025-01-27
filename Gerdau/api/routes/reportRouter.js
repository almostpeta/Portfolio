import ReportServices from "../controllers/reportController.js";
import { Router } from "express";
import { catchAsync, Search } from "../utils/utils.js";
import { exportAsCSV } from "../utils/exportToCsv.js";

const reportServices = new ReportServices();

export default class ReportRouter {
  constructor() {
    this.router = Router();
    this.router.get("/faultsByMachine", catchAsync(this.faultsByMachine));
    this.router.get("/faultsByUser", catchAsync(this.faultsByUser));
    this.router.get("/faultsPerMonth", catchAsync(this.faultsPerMonth));
    this.router.get("/faultsPending", catchAsync(this.faultsPending));
    this.router.get("/machineQuantity", catchAsync(this.machineQuantity));
    this.router.get("/taskPerMachine", catchAsync(this.taskPerMachine));
    this.router.get("/taskPerMonth", catchAsync(this.taskPerMonth));
    this.router.get("/faultsByType", catchAsync(this.faultsByType));
    this.router.get("/faultsQuantity", catchAsync(this.faultsQuantity));
    this.router.get("/faultsDaysQuantity", catchAsync(this.faultsDaysQuantity));
    this.router.get("/tasksDaysQuantity", catchAsync(this.tasksDaysQuantity));
    this.router.get("/tasksQuantity", catchAsync(this.tasksQuantity));
    this.router.get("/jsonArrayToCsv", catchAsync(this.jsonArrayToCsv));
    this.router.get("/tableAsCsv", catchAsync(this.tableAsCsv));
  }

  async faultsByMachine(req, res) {
    const data = await reportServices.faultsByMachine();
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsByUser(req, res) {
    const data = await reportServices.faultsByUser();
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsPerMonth(req, res) {
    const data = await reportServices.faultsPerMonth(req.param.year);
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsPending(req, res) {
    const data = await reportServices.faultsPending();
    res.send(new Search(200, "Success", "Success", data));
  }
  async machineQuantity(req, res) {
    const data = await reportServices.machineQuantity();
    res.send(new Search(200, "Success", "Success", data));
  }
  async taskPerMachine(req, res) {
    const data = await reportServices.taskPerMachine();
    res.send(new Search(200, "Success", "Success", data));
  }
  async taskPerMonth(req, res) {
    const data = await reportServices.taskPerMonth(req.param.year);
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsByType(req, res) {
    const data = await reportServices.faultsByType();
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsQuantity(req, res) {
    const data = await reportServices.faultsQuantity();
    res.send(new Search(200, "Success", "Success", data));
  }
  async faultsDaysQuantity(req, res) {
    const data = await reportServices.faultsDaysQuantity();
    res.send(new Search(200, "Success", "Success", data));
  }
  async tasksQuantity(req, res) {
    const data = await reportServices.tasksQuantity();
    res.send(new Search(200, "Success", "Success", data));
  }
  async tasksDaysQuantity(req, res) {
    const data = await reportServices.tasksDaysQuantity();
    res.send(new Search(200, "Success", "Success", data));
  }
  async jsonArrayToCsv(req, res) {
    exportAsCSV(res, req.body.table, Date.now());
  }
  async tableAsCsv(req, res) {
    const table = await reportServices.tableAsCsv(req.query.table);
    exportAsCSV(res, table, Date.now());
  }
}
