// models/District.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      // define associations here
      District.belongsTo(models.Province, {
        foreignKey: 'province_id',
        as: 'province'
      });

      District.hasMany(models.Ward, {
        foreignKey: 'district_id',
        as: 'wards'
      });

      District.hasMany(models.Address, {
        foreignKey: 'district_id',
        as: 'addresses'
      });
    }
  }
  
  District.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provinces',
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
    modelName: 'District',
    tableName: 'districts',
    timestamps: true,
    underscored: true
  });
  
  return District;
};