'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			supplier_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Suppliers',
					key: 'supplier_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Categories',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
			product_name: {
				type: Sequelize.STRING,
			},
			product_description: {
				type: Sequelize.TEXT,
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
					'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
				),
			},
			is_deleted: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Products');
	},
};
