'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
      static associate(models) {
        // define associations here
        Province.hasMany(models.District, { 
          foreignKey: 'province_id', 
          as: 'districts' 
        });
  
        Province.hasMany(models.Address, { 
          foreignKey: 'province_id', 
          as: 'addresses' 
        });
      }
    }
    
    Province.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
      modelName: 'Province',
      tableName: 'provinces',
      timestamps: true,
      underscored: true
    });
    
    return Province;
  };