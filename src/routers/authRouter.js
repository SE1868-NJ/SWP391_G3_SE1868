const express = require('express');
const AuthController = require('../controller/authController');

const router = express.Router();

router.get('/login', AuthController.login);
router.get('/auth/google/callback', AuthController.googleCallback);

module.exports = router;