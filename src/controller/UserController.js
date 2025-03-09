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
        const id = req.params.id;
        const user = req.body;

        try {
            const updatedUser = await UserService.updateUser(id, user);
            return this.convertToJson(res, 200, { message: 'Cập nhật thành công!', updatedUser});
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    uploadAvatar = async (req, res) => {
        try {
            const userId = req.params.id;

            if (!req.files || !req.files.avatar) {
                return res.status(400).json({ message: "No file uploaded" });
            }
    
            const avatarFile = req.files.avatar;
            const fileName = `${userId}_${Date.now()}_${avatarFile.name}`;
            const uploadPath = path.join(__dirname, '../uploads/', fileName);
    
            await avatarFile.mv(uploadPath);
            const avatarUrl = `http://localhost:4000/uploads/${fileName}`;
            
            await UserService.updateAvatar(userId, avatarUrl);
            return this.convertToJson(res, 200, { message: "Avatar updated successfully", avatar: avatarUrl });
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new UserController();