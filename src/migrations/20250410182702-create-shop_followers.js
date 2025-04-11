'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ShopFollowers', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			shop_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Shops',
					key: 'shop_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'user_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		// Tạo unique constraint để tránh user follow trùng shop
		await queryInterface.addConstraint('ShopFollowers', {
			fields: ['shop_id', 'user_id'],
			type: 'unique',
			name: 'unique_shop_user_follow',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('ShopFollowers');
	},
};
