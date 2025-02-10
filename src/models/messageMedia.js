'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageMedia extends Model {
    static associate(models) {
      MessageMedia.belongsTo(models.Message, { foreignKey: 'message_id', onDelete: 'CASCADE' });
    }
  }
  MessageMedia.init({
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    media_type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MessageMedia',
  });
  return MessageMedia;
};
