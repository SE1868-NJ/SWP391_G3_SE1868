'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			userID: {
				field: 'user_id',
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			googleID: {
				field: 'google_id',
				type: Sequelize.STRING,
				unique: true,
			},
			facebookID: {
				field: 'facebook_id',
				type: Sequelize.STRING,
				unique: true,
			},
			avatar: {
				type: Sequelize.STRING,
			},
			fullName: {
				field: 'full_name',
				type: Sequelize.STRING,
				allowNull: false,
			},
			gender: {
				type: Sequelize.ENUM('male', 'female', 'other'),
				allowNull: false,
			},
			dateOfBirth: {
				field: 'date_of_birth',
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
