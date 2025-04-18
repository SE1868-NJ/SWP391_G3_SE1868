'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Shop extends Model {
		static associate(models) {
			Shop.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE', });
			Shop.hasMany(models.Product, { foreignKey: 'shop_id', as: 'products' });
			Shop.hasMany(models.Supplier, { foreignKey: 'shop_id', as: 'suppliers' });
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
			},
			shop_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			shop_description: {
				type: DataTypes.STRING,
			},
			shop_logo: {
				type: DataTypes.STRING,
			},
			shop_address: {
				type: DataTypes.STRING,
			},
			shop_phone: {
				type: DataTypes.STRING,
			},
			shop_email: {
				type: DataTypes.STRING,
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
			tableName: 'Shops',
			timestamps: false,
		}
	);
	return Shop;
};
