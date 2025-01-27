import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const Area = models.area;
export default class AreaService {
  // find all area
  async getAllAreas() {
    return await Area.findAll({ raw: true });
  }

  // find all area by plant
  async getAllAreasByPlant(plant) {
    return await Area.findAll({ where: { plantId: plant }, raw: true });
  }

  // find one area
  async getOneArea(nameArea) {
    return await Area.findOne({ where: { name: nameArea }, raw: true });
  }
}
