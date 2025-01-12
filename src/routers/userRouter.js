const express = require('express');
const router = express.Router();

const userController = require('../controller/UserController');

router.get('/getUser', userController.getAllUsers);

module.exports = router;
