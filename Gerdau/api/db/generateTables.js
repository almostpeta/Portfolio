import sequelize from "../db/dbconection.js";

export default async function generateTables(req, res) {
  var aux = process.env.GENERATE_TABLES == "true";
  if (aux) {
    sequelize.sync({ force: true });
    // Force sync all models
    // It will drop the table first
    // and re-create it afterwards
    //sequelize.sync();
  }
}
