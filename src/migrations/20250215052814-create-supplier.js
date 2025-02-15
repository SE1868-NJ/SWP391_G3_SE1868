'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suppliers', {
      supplier_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      supplier_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      contact_name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      note: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};
