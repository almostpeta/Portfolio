import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("plant", {
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

    location: {
      type: Sequelize.STRING,
    },

    country: {
      type: Sequelize.STRING,
    },
  });
};
