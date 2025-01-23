'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    google_id: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "Last name must be between 1 and 100 characters in length.",
      },
      }
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};