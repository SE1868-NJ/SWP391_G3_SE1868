'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('feedback', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'user_id',
				},
				onDelete: 'CASCADE',
			},
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Products',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			ratting: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
			comment: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			is_update: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal(
					'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
				),
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('feedback');
	},
};
