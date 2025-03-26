const express = require('express');
const { loginLimit } = require('../middlewares/loginLimit.middleware');
const AuthController = require('../controller/authController');
const passport = require('passport');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/google', AuthController.loginGoogle);
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);

router.get('/auth/facebook', AuthController.loginFacebook);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), AuthController.facebookCallback);

router.post('/auth/register', AuthController.register);
// router.post('/auth/login', loginLimit, AuthController.login);

// Basic login
router.post('/auth/login', loginLimit, AuthController.login);
router.get('/auth/me', verifyToken, AuthController.getCurrentUser);

module.exports = router;