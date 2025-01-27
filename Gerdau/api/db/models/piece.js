import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("piece", {
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

    identifier: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    manufacturer: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    provider: {
      type: Sequelize.STRING,
    },

    //componentID

    specifications: {
      type: Sequelize.STRING,
    },

    make: {
      type: Sequelize.STRING,
    },

    model: {
      type: Sequelize.STRING,
    },

    working_from_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    //responsibleID

    manufacturer_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    electric_faults_count: {
      type: Sequelize.INTEGER,
    },

    neumatic_faults_count: {
      type: Sequelize.INTEGER,
    },

    hydraulic_faults_count: {
      type: Sequelize.INTEGER,
    },

    mechanic_faults_count: {
      type: Sequelize.INTEGER,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
