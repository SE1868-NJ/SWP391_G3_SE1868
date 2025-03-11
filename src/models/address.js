// models/Address.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // define associations here
      Address.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Address.belongsTo(models.Province, {
        foreignKey: 'province_id',
        as: 'province'
      });

      Address.belongsTo(models.District, {
        foreignKey: 'district_id',
        as: 'district'
      });

      Address.belongsTo(models.Ward, {
        foreignKey: 'ward_id',
        as: 'ward'
      });
    }
  }
  
  Address.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(15),
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
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'districts',
        key: 'id'
      }
    },
    ward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wards',
        key: 'id'
      }
    },
    street_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address_type: {
      type: DataTypes.ENUM('home', 'office'),
      defaultValue: 'home'
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_pickup_address: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
    underscored: true
  });
  
  return Address;
};