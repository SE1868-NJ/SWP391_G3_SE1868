'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// User.hasMany(models.Feedback, { foreignKey: 'user_id', as: 'feedbacks' });
			// User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
			// User.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' });
			User.hasMany(models.Cart, {
				foreignKey: 'user_id',
				as: 'carts'
			});
			User.hasMany(models.Shop, {
				foreignKey: 'user_id',
				as: 'shops'
			});
			User.hasMany(models.Order, {
				foreignKey: 'user_id',
				as: 'orders',
				onDelete: 'CASCADE',
			});
		}
	}

	User.init(
		{
			user_id: {
				field: 'user_id',
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			google_id: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					len: [0, 255],
				},
			},
			facebook_id: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					len: [0, 255],
				},
			},
			user_name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 255],
				},
			},
			user_avatar: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [0, 255],
				},
			},
		},
		{
			sequelize,
			timestamps: true,
			modelName: 'User',
			tableName: 'users',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);

	return User;
};