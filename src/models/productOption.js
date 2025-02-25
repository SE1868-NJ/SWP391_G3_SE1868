'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ProductOption extends Model {
		static associate(models) {}
	}

	ProductOption.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			option_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'ProductOption',
			tableName: 'ProductOptions',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	);

	return Product;
};
