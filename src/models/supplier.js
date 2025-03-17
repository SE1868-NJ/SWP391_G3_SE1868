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
      supplier_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: 'Mã nhà cung cấp không được để trống' },
        },
      },
      supplier_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Tên nhà cung cấp không được để trống' },
        },
      },
      delivery_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Thời gian giao hàng phải là số nguyên' },
          min: { args: [1], msg: 'Thời gian giao hàng phải lớn hơn 0' },
        },
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
        validate: {
          notEmpty: { msg: 'Địa chỉ không được để trống' },
        },
      },
      contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Họ và tên không được để trống' },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Số điện thoại không được để trống' },
          is: {
            args: [/^\d{10,11}$/],
            msg: 'Số điện thoại không hợp lệ',
          },
        },
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