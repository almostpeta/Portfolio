import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("stage", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
