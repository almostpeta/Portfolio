import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("solution", {
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

    relevant_data: {
      type: Sequelize.STRING(1000),
    },

    reject_reason: {
      type: Sequelize.STRING(2000),
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
