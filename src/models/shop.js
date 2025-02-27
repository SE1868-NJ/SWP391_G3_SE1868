'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Shop extends Model {
		static associate(models) {
			Shop.hasMany(models.Product, {
				foreignKey: 'shop_id',
				as: 'products',
				onDelete: 'CASCADE'
			});
			Shop.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
				onDelete: 'CASCADE'
			});
		}
	}

	Shop.init(
		{
			shop_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'User',
					key: 'user_id',
				},
				validate: {
					notEmpty: true,
					isInt: true,
				},
			},
			shop_name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 255],
				},
			},
			shop_description: {
				type: DataTypes.STRING,
				validate: {
					len: [0, 1000],
				},
			},
			shop_logo: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				},
			},
			shop_address: {
				type: DataTypes.STRING,
				validate: {
					len: [0, 500],
				},
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: 'Shop',
			tableName: 'shops',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
		}
	);

	return Shop;
};