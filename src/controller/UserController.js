// const User = require('../models/user');
const UserService = require('../services/userService');
const BaseController = require('./baseController');

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
        if (user.hasOwnProperty("0")) {
            delete user["0"];
        }
        console.log("ID nhận được:", id);
        console.log("Dữ liệu cập nhật:", req.body);

        try {
            const updatedUser = await UserService.updateUser(id, user);
            console.log("test update:",updatedUser);
            return this.convertToJson(res, 200, updatedUser);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    uploadAvatar = async (req, res) => {
        const id = req.params.id;
        if (!req.files || !req.files.avatar) {
            return this.convertToJson(res, 400, { message: 'No file uploaded' });
        }
    
        const avatarFile = req.files.avatar;
        const fileName = `${id}_avatar_${avatarFile.name}`;
        const uploadPath = `uploads/${fileName}`;
    
        try {
            // Lưu file lên server
            await avatarFile.mv(uploadPath);
    
            // Cập nhật URL ảnh trong database
            const avatarUrl = `/uploads/${fileName}`;
            const updatedUser = await UserService.updateAvatar(id, avatarUrl);
    
            return this.convertToJson(res, 200, updatedUser);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
    
}

module.exports = new UserController();