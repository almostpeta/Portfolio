import Sequelize from "sequelize";
import associations from "./associations.js";

const sequelize = new Sequelize(
  `${process.env.DATABASE}`,
  `${process.env.DB_USER}`,
  `${process.env.PASSWORD}`,
  {
    host: `${process.env.SERVER}`,
    dialect: "mssql",
    port: `${process.env.DB_PORT}`,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

const modelDefiners = [
  require("./models/area"),
  require("./models/cause"),
  require("./models/causeFile"),
  require("./models/component"),
  require("./models/componentFile"),
  require("./models/fault"),
  require("./models/faultFile"),
  require("./models/machine"),
  require("./models/machineFile"),
  require("./models/piece"),
  require("./models/pieceFile"),
  require("./models/plant"),
  require("./models/solution"),
  require("./models/solutionFile"),
  require("./models/study"),
  require("./models/studyFile"),
  require("./models/sublevel"),
  require("./models/user"),
  require("./models/fieldHistory"),
  require("./models/method"),
  require("./models/methodFile"),
  require("./models/token"),
  require("./models/task"),
  require("./models/causeFault"),
  require("./models/stage"),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
associations(sequelize);

export default sequelize;
