const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const userController = require('../controller/UserController');

router.get('/getUsers', userController.getAllUsers);
router.get('/getUser', userController.getUserById);
router.put('/updateUser', userController.updateUser);

module.exports = router;
