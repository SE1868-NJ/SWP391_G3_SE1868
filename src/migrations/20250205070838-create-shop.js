'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('shops', {
			shop_id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'user_id',
				},
				onDelete: 'CASCADE',
			},
			shop_name: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			shop_description: {
				type: Sequelize.STRING(1000),
				allowNull: true,
			},
			shop_logo: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			shop_address: {
				type: Sequelize.STRING(500),
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('shops');
	},
};