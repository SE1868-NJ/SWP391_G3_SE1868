'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'provinces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'districts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ward_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'wards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      street_address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address_type: {
        type: Sequelize.ENUM('home', 'office'),
        defaultValue: 'home'
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_pickup_address: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
  }
};
