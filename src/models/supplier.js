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
      delivery_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING,
      },
      account_number: {
        type: DataTypes.STRING,
      },
      payment_term: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM('Hoạt động', 'Không hoạt động'),
        defaultValue: 'Hoạt động',
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