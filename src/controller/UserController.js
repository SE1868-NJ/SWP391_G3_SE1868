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
        try {
            const userId = req.params.id;
    
            // Kiểm tra xem file có được gửi lên không
            if (!req.files || !req.files.avatar) {
                return res.status(400).json({ message: "No file uploaded" });
            }
    
            const avatarFile = req.files.avatar;
            const fileName = `${userId}_${Date.now()}_${avatarFile.name}`;
            const uploadPath = path.join(__dirname, '../uploads/', fileName);
    
            // Dùng Promise để đảm bảo file lưu thành công trước khi cập nhật DB
            await avatarFile.mv(uploadPath);
    
            // Tạo URL trả về
            const avatarUrl = `http://localhost:4000/uploads/${fileName}`;
    
            // Cập nhật đường dẫn avatar vào database
            await UserRepository.update(userId, { avatar: avatarUrl });
    
            console.log("📤 API response:", { message: "Avatar updated successfully", avatar: avatarUrl });
    
            return res.json({ message: "Avatar updated successfully", avatar: avatarUrl });
        } catch (error) {
            console.error("Lỗi upload avatar:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    };
}

module.exports = new UserController();