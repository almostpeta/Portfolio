import Sequelize, { DataTypes } from "sequelize";

module.exports = (sequelize) => {
  sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        throw new Error("This is a readonly field");
      },
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: Sequelize.STRING,
    },

    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
};
