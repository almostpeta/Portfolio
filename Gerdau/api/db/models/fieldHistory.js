import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("fieldHistory", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    old_value: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    new_value: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    field: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
