'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			google_id: {
				type: Sequelize.STRING,
				unique: true,
			},
			facebook_id: {
				type: Sequelize.STRING,
				unique: true,
			},

			avatar: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			gender: {
				type: Sequelize.ENUM('male', 'female', 'other'),
				allowNull: false,
			},
			date_of_birth: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},

			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true,
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
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
