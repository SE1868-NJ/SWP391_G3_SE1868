const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const userController = require('../controller/UserController');

router.get('/user', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);

module.exports = router;
