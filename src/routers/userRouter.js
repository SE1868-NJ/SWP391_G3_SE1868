const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.get('/getUsers', userController.getAllUsers);

module.exports = router;
