'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('orders', {
			orderID: {
				field: 'order_id',
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userID: {
				field: 'user_id',
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'user_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			totalAmount: {
				field: 'total_amount',
				type: Sequelize.DECIMAL,
				allowNull: false,
			},
			status: {
				field: 'status',
				type: Sequelize.ENUM(
					'pending',
					'confirmed',
					'processing',
					'shipped',
					'delivered',
					'canceled',
					'returned'
				),
				allowNull: false,
				defaultValue: 'pending',
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
		queryInterface.dropTable('orders');
	},
};
