const userService = require('../services/userService');
const fileService = require('../services/fileService');
const BaseController = require('./baseController');
const path = require('path');
const fs = require('fs');

class UserController extends BaseController {
  constructor() {
    super();
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      return this.convertToJson(res, 200, users);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getUserById = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userService.getUserById(id);
      return this.convertToJson(res, 200, user);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // Cập nhật phương thức updateUser trong UserController

  updateUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      let userData = {
        full_name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender
      };

      // Handle avatar upload
      if (req.file) {
        const file = req.file;

        if (file.size > 2 * 1024 * 1024) {
          return this.convertToJson(res, 400, {
            status: "error",
            message: "Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 2MB."
          });
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
          return this.convertToJson(res, 400, {
            status: "error",
            message: "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG."
          });
        }

        try {
          // Upload to Minio
          const result = await fileService.uploadFile(file, 'user_avatars');
          userData.avatar = result.url;
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          return this.convertToJson(res, 500, {
            status: "error",
            message: "Lỗi khi tải lên ảnh đại diện."
          });
        }
      }

      const result = await userService.updateUser(userId, userData);

      // Trả về response chuẩn
      return this.convertToJson(res, 200, {
        status: "success",
        message: "Cập nhật thành công",
        data: result
      });
    } catch (error) {
      console.error("Error in updateUser:", error);
      return this.convertToJson(res, 500, {
        status: "error",
        message: error.message || "Đã xảy ra lỗi khi cập nhật thông tin người dùng."
      });
    }
  }
}

module.exports = new UserController();