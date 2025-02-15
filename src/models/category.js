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
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
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