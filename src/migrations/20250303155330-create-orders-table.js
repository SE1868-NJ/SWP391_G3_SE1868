'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      order_id: {
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
        onDelete: 'RESTRICT'
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'address',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      voucher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: 'vouchers',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      shop_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'shops',
          key: 'shop_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
