'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Ward extends Model {
        static associate(models) {
            // define associations here
            Ward.belongsTo(models.District, {
                foreignKey: 'district_id',
                as: 'district'
            });

            Ward.hasMany(models.Address, {
                foreignKey: 'ward_id',
                as: 'addresses'
            });
        }
    }

    Ward.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'districts',
                key: 'id'
            }
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Ward',
        tableName: 'wards',
        timestamps: true,
        underscored: true
    });

    return Ward;
};