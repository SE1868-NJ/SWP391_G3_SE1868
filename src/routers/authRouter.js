// routers/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;