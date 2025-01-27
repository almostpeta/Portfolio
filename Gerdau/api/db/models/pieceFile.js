import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("pieceFile", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    file: {
      type: Sequelize.STRING,
    },

    originalName: {
      type: Sequelize.STRING,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
