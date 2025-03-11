'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
            // Category.belongsTo(models.Category, { foreignKey: 'parent_id', as: 'parent' });
            // Category.hasMany(models.Category, { foreignKey: 'parent_id', as: 'children' });
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