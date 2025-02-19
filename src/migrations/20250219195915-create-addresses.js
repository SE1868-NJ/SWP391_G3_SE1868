'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('addresses', {
			addressID: {
				field: 'address_id',
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
			fullName: {
				field: 'full_name',
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				field: 'phone',
				type: Sequelize.STRING,
				allowNull: false,
			},
			province: {
				field: 'province',
				type: Sequelize.STRING,
				allowNull: false,
			},
			city: {
				field: 'city',
				type: Sequelize.STRING,
				allowNull: false,
			},
			district: {
				field: 'district',
				type: Sequelize.STRING,
				allowNull: false,
			},
			ward: {
				field: 'ward',
				type: Sequelize.STRING,
				allowNull: false,
			},
			street: {
				field: 'street',
				type: Sequelize.STRING,
				allowNull: false,
			},
			isDefault: {
				field: 'is_default',
				type: Sequelize.BOOLEAN,
			},
			isDelete: {
				field: 'is_delete',
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable('addresses');
	},
};
