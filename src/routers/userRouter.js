const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controller/UserController');

// Cấu hình multer cho upload avatar
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Get all users
router.get('/user', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user - matching the shop update pattern
router.post('/:id/update', upload.single('avatar'), userController.updateUser);

module.exports = router;