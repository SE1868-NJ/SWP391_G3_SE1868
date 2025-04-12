"use strict";
const { Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmailTemplate extends Model {
		static getEmailTypes() {
			return [
				"welcome_user", "voucher_expiry_warning", "livestream_announcement", 
				"login_alert", "shipping_update"
			];
		}
    static associate(models) {
      // define association here if needed in future
    }
  }

  EmailTemplate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "welcome_user",
          "voucher_expiry_warning",
          "livestream_announcement",
          "login_alert",
          "shipping_update"
        ),
        defaultValue: "promotion",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "EmailTemplate",
      tableName: "email_templates",
      timestamps: false, // vì đã dùng created_at, updated_at thủ công
      underscored: true,
    }
  );

  return EmailTemplate;
};
