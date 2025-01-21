const express = require('express');
const AuthController = require('../controller/authController');
const passport = require('passport');

const router = express.Router();

router.get('/login',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);

module.exports = router;