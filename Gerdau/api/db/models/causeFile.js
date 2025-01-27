import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("causeFile", {
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

    relatedTo: {
      type: Sequelize.STRING,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
