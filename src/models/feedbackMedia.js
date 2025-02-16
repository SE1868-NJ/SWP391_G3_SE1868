"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeedbackMedia extends Model {
    static associate(models) {
        FeedbackMedia.belongsTo(models.Feedback, { foreignKey: "feedback_id" });
    }
  }

  FeedbackMedia.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      feedback_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Feedback",
          key: "feedback_id",
        },
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FeedbackMedia",
      tableName: "feedback_media",
    }
  );

  return FeedbackMedia;
};
