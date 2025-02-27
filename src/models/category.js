'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Product, {
                foreignKey: 'category_id',
                as: 'products',
                onDelete: 'SET NULL' // Hoặc 'CASCADE' tùy theo yêu cầu
            });
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
        category_description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    });

    return Category;
};