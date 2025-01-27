import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const Plant = models.plant;

export default class PlantService {
  // find all plants
  async getAllPlants() {
    return await Plant.findAll({ raw: true });
  }

  // find one plant
  async getOnePlant(namePlant) {
    return await Plant.findOne({ where: { name: namePlant }, raw: true });
  }
}
