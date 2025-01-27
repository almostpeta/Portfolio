const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

var sequelize = new Sequelize(
  `${process.env.DATABASE}`,
  `${process.env.USER}`,
  `${process.env.PASSWORD}`,
  {
    host: `${process.env.SERVER}`,
    port: `${process.env.DB_PORT}`,
    dialect: "mssql",
    ssl: "Amazon RDS",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    language: "en",
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

test();
