const express = require('express');
const AuthController = require('../controller/authController');
const passport = require('passport');

const router = express.Router();

router.get('/auth/google', AuthController.loginGoogle);
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);

router.get('/auth/facebook', AuthController.loginFacebook);
router.get('/auth/facebook/callback',passport.authenticate('facebook', { session: false }),AuthController.facebookCallback);

module.exports = router;