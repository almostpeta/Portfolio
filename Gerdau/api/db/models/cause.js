import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("cause", {
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

    // reporter_by -- userId

    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    reason: {
      type: Sequelize.STRING(2000),
    },

    relevant_data: {
      type: Sequelize.STRING(2000),
    },

    reject_reason: {
      type: Sequelize.STRING(2000),
    },

    number_of_uses: {
      type: Sequelize.INTEGER,
      default: 0,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
