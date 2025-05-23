'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
			// User.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' });
			this.hasMany(models.Feedback, { foreignKey: 'user_id', as: 'feedbacks' });
			this.hasOne(models.Shop, { foreignKey: 'user_id', as: 'shop' });
		}
	}

	User.init(
		{
			userID: {
				field: 'user_id',
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			googleID: {
				field: 'google_id',
				type: DataTypes.STRING,
				unique: true,
			},
			facebookID: {
				field: 'facebook_id',
				type: DataTypes.STRING,
				unique: true,
			},
			avatar: {
				type: DataTypes.STRING,
			},
			full_name: {
				field: 'full_name',
				type: DataTypes.STRING,
				allowNull: false,
			},
			gender: {
				type: DataTypes.ENUM('male', 'female', 'other'),
				allowNull: false,
			},
			dateOfBirth: {
				field: 'date_of_birth',
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
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