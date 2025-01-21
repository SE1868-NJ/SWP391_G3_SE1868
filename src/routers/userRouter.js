const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const userController = require('../controller/userController');

router.get('/getUsers', verifyToken, userController.getAllUsers);

module.exports = router;
