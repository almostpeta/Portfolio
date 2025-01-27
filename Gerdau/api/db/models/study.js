import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("study", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    internal_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    reason: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },

    //componentID

    //pieceID

    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    //userID

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
