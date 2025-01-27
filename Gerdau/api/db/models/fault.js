import Sequelize from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("fault", {
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

    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    clasification: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING(2000),
    },

    description_record: {
      type: Sequelize.STRING,
    },

    start_date_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    end_date_time: {
      type: Sequelize.DATE,
    },

    consequences: {
      type: Sequelize.STRING(2000),
    },

    consequences_record: {
      type: Sequelize.STRING,
    },

    relevant_data: {
      type: Sequelize.STRING(2000),
    },

    relevant_data_record: {
      type: Sequelize.STRING,
    },

    priority: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    are_measures: {
      type: Sequelize.BOOLEAN,
    },

    analyzed_measures: {
      type: Sequelize.STRING(2000),
    },

    fault_number: {
      type: Sequelize.STRING,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
