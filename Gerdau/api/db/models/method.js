import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("method", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    description: {
      type: Sequelize.STRING(3000),
      allowNull: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
