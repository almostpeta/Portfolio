import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("component", {
    //machineID

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

    serie_number: {
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

    provider: {
      type: Sequelize.STRING,
    },

    // responsibleID

    description: {
      type: Sequelize.STRING(2000),
    },

    relevant_data: {
      type: Sequelize.STRING(2000),
    },

    manufacturer_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    state: {
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
