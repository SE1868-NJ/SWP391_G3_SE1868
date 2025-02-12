'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: 'conversation_id', onDelete: 'CASCADE' });
      Message.hasMany(models.MessageMedia, { foreignKey: 'message_id', onDelete: 'CASCADE' });
    }
  }
  Message.init({
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sender_type: {
        type: DataTypes.ENUM('user', 'shop'),
      allowNull: true
    },
    message_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    message_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Message',
    primaryKey: false,
    timestamps: false
  });
  return Message;
};
