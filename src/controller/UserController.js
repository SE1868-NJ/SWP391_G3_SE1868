// const User = require('../models/user');
const UserService = require('../services/userService');
const BaseController = require('./baseController');
const path = require('path');
const fs = require('fs');
const UserRepository = require('../repositories/UserRepository');
const FileController = require('./FileController');

class UserController extends BaseController {
  constructor() {
    super();
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      return this.convertToJson(res, 200, users); z
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

        // Tạo request giả để sử dụng uploadFile
        const mockReq = {
          file: {
            buffer: avatarFile.data,
            originalname: avatarFile.name,
            mimetype: avatarFile.mimetype
          },
          body: { prefix_name: 'avatars' }
        };

        // Tạo response giả
        const mockRes = {
          status: () => mockRes,
          json: (data) => data
        };

        try {
          const uploadResult = await FileController.uploadFile(mockReq, mockRes);

          // Kiểm tra kỹ hơn kết quả upload
          if (uploadResult.status === 'success' && uploadResult.data && uploadResult.data.fileUrl) {
            avatarUrl = uploadResult.data.fileUrl;
            userData.avatar = avatarUrl;
          } else {
            console.error('Upload failed:', uploadResult);
            throw new Error(uploadResult.data.message || 'Upload avatar failed');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          // Nếu upload avatar thất bại, vẫn cho phép cập nhật các thông tin khác
          console.warn('Avatar upload failed, continuing with user update');
        }
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