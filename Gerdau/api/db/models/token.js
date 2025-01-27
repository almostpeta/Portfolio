import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("token", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
};
