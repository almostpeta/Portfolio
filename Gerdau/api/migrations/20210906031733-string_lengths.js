"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("causes", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("causes", "reason", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("causes", "relevant_data", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("causes", "reject_reason", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("components", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("components", "relevant_data", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("faults", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("faults", "consequences", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("faults", "relevant_data", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("faults", "analyzed_measures", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("machines", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("machines", "relevant_data", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("methods", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("solutions", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("solutions", "reject_reason", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("studies", "reason", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("tasks", "description", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("tasks", "reason", {
      type: Sequelize.STRING(2000),
    });
  },

  down: (queryInterface, Sequelize) => {},
};
