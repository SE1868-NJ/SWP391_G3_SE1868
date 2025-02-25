'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('order_details', {
			orderDetailID: {
				field: 'order_detail_id',
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			orderID: {
				field: 'order_id',
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'order_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			price: {
				field: 'price',
				type: Sequelize.DECIMAL,
				allowNull: false,
			},
			quantity: {
				field: 'quantity',
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			createdAt: {
				field: 'created_at',
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				field: 'updated_at',
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable('order_details');
	},
};
