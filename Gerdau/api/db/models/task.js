import Sequelize, { DataTypes } from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("task", {
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

    description: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },

    reason: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },

    deadline: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    start_date: {
      type: Sequelize.DATE,
    },

    complete_date: {
      type: Sequelize.DATE,
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
