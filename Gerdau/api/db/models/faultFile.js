import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("faultFile", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    file: {
      type: Sequelize.STRING,
    },
    faultId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: "fault",
        key: "id",
      },
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
