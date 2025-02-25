'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			this.belongsTo(models.Supplier, {
				foreignKey: 'supplier_id',
				as: 'supplier',
			});
			this.belongsTo(models.Category, {
				foreignKey: 'category_id',
				as: 'category',
			});
			this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
			this.hasMany(models.Feedback, {
				foreignKey: 'product_id',
				as: 'feedbacks',
			});
			this.hasMany(models.Cart, {
				foreignKey: 'product_id',
				as: 'carts',
			});
		}
	}

	Product.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			supplier_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			shop_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			product_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			product_description: {
				type: DataTypes.TEXT,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		},
		{
			sequelize,
			modelName: 'Product',
			tableName: 'Products',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	);

	return Product;
};
