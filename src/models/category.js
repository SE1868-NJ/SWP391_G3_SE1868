'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // Nếu có quan hệ với Supplier, có thể thêm tại đây
            // Example: this.hasMany(models.Supplier);
        }
    }

    Category.init({
        category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
    },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'Categories',
            timestamps: true,
        }
    );

    return Category;
};