'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {}
	}

	User.init(
		{
			userID: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			googleID: {
				type: DataTypes.STRING,
				unique: true,
			},
			facebookID: {
				type: DataTypes.STRING,
				unique: true,
			},

			avatar: {
				type: DataTypes.STRING,
			},
			fullName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			gender: {
				type: DataTypes.ENUM('male', 'female', 'other'),
				allowNull: false,
			},
			dateOfBirth: {
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
			userID: 'user_id',
			googleID: 'google_id',
			facebookID: 'facebook_id',
			dateOfBirth: 'date_of_birth',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);
	return User;
};
