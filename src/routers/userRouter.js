const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const userController = require('../controller/UserController');

router.get('/getUsers', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.put('/user/:id/upload-avatar', userController.uploadAvatar);
module.exports = router;
