import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const Sublevel = models.sublevel;
export default class SublevelService {
  // find all sublevels
  async getAllSublevels() {
    return await Sublevel.findAll({ raw: true });
  }

  // find all sublevels by area
  async getAllSublevelsByArea(area) {
    return await Sublevel.findAll({ where: { areaId: area }, raw: true });
  }

  // find one sublevel
  async getOneSublevel(nameSublevel) {
    return await Sublevel.findOne({ where: { name: nameSublevel }, raw: true });
  }
}
