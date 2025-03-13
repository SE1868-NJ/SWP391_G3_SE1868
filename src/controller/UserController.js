// const User = require('../models/user');
const UserService = require('../services/userService');
const BaseController = require('./baseController');
const path = require('path');
const fs = require('fs');
const UserRepository = require('../repositories/UserRepository'); 

class UserController extends BaseController {
    constructor() {
        super();
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            return this.convertToJson(res, 200, users);z
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getUserById = async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserService.getUserById(id);
            return this.convertToJson(res, 200, user);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateUser = async (req, res) => {
        try {
          const userId = req.params.id;
          const userData = req.body;
          let avatarUrl = null;

          if (req.files && req.files.avatar) {
            const avatarFile = req.files.avatar;
            const fileName = `${userId}_${Date.now()}_${avatarFile.name}`;
            const uploadPath = path.join(__dirname, '../uploads/', fileName);
            
            await avatarFile.mv(uploadPath);
            avatarUrl = `http://localhost:4000/uploads/${fileName}`;

            userData.avatar = avatarUrl;
          }

          const updatedUser = await UserService.updateUser(userId, userData);
          
          return this.convertToJson(res, 200, { 
            message: 'Cập nhật thành công!', 
            updatedUser 
          });
        } catch (error) {
          return this.handleError(res, error);
        }
      };
}

module.exports = new UserController();