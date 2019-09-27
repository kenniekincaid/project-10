'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false
      },
      emailAddress: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};