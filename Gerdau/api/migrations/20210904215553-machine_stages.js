"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("stages", {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.DataTypes.STRING,
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      });

      await queryInterface.createTable("machineStage", {
        machineId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: {
              tableName: "machines",
              schema: "dbo",
            },
          },
          allowNull: false,
        },
        stageId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: {
              tableName: "stages",
              schema: "dbo",
            },
            key: "id",
          },
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      });
      await queryInterface.addColumn("faults", "stageId", {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: "stages",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      });
      await queryInterface.removeColumn("machines", "stages");
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable("stage");
      await queryInterface.addColumn("machine", "stages");
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
