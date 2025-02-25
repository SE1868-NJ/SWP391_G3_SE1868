'use strict';
const { Model } = require('DataTypes');

module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		static associate(models) {
			Order.belongsTo(models.User, { foreignKey: 'user_id' });
		}
	}

	Order.init(
		{
			orderID: {
				field: 'order_id',
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
			totalAmount: {
				field: 'total_amount',
				type: DataTypes.DECIMAL,
				allowNull: false,
			},
			status: {
				field: 'status',
				type: DataTypes.ENUM(
					'pending',
					'confirmed',
					'processing',
					'shipped',
					'delivered',
					'canceled',
					'returned',
				),
				allowNull: false,
				defaultValue: 'pending',
			},
		},
		{
			DataTypes,
			timestamps: true,
			modelName: 'Order',
			tableName: 'orders',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	);
	return Order;
};
