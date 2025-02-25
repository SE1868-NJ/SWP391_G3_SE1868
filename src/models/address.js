'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Address extends Model {
		static associate(models) {
			Address.belongsTo(models.User, { foreignKey: 'user_id' });
			Address.hasMany(models.Order, { foreginKey: 'address_id' });
		}
	}

	Address.init(
		{
			addressID: {
				field: 'address_id',
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userID: {
				field: 'user_id',
				type: DataTypes.INTEGER,
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
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				field: 'phone',
				type: DataTypes.STRING,
				allowNull: false,
			},
			province: {
				field: 'province',
				type: DataTypes.STRING,
				allowNull: false,
			},
			city: {
				field: 'city',
				type: DataTypes.STRING,
				allowNull: false,
			},
			district: {
				field: 'district',
				type: DataTypes.STRING,
				allowNull: false,
			},
			ward: {
				field: 'ward',
				type: DataTypes.STRING,
				allowNull: false,
			},
			street: {
				field: 'street',
				type: DataTypes.STRING,
				allowNull: false,
			},
			isDefault: {
				field: 'is_default',
				type: DataTypes.BOOLEAN,
			},
			isDelete: {
				field: 'is_delete',
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			sequelize,
			timestamps: true,
			modelName: 'Address',
			tableName: 'addresses',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	);
	return Address;
};
