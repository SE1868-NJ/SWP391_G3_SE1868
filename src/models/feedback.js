'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        static associate(models) {
            Feedback.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
            Feedback.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
            Feedback.hasMany(models.FeedbackMedia, { foreignKey: 'feedback_id', as: 'media' });
        }
    }

    Feedback.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            is_update: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: 'Feedback',
            tableName: 'Feedbacks',
            timestamps: false,
        }
    );

    return Feedback;
};