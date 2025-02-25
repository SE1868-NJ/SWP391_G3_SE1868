'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('product_options', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'products',
					key: 'product_id',
				},
			},
			option_name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable('product_options');
	},
};
