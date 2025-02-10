'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, { foreignKey: 'conversation_id', onDelete: 'CASCADE' });
      Conversation.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Conversation.belongsTo(models.Shop, { foreignKey: 'shop_id', onDelete: 'CASCADE' });
    }
  }
  Conversation.init({
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Conversation',
    timestamps: false
  });
  return Conversation;
};