'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        static associate(models) {
            // Nếu có quan hệ với Category, có thể thêm tại đây
            // Example: this.belongsTo(models.Category);
        }
    }

    Supplier.init(
        {
            supplier_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            supplier_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            delivery_name: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            contact_name: {
                type: DataTypes.STRING,
            },
            phone_number: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
            },
            note: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Supplier',
            tableName: 'Suppliers',
            timestamps: true,
        }
    );

    return Supplier;
};