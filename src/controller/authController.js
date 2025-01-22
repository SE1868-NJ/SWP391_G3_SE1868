const passport = require('passport');
const AuthService = require('../services/authService');
const BaseController = require('./baseController');

class AuthController extends BaseController {
  // Middleware cho login với Google
  login = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email']})(req, res, next);
  };

  googleCallback = async (req, res) => {
    try {
      const { token } = req.user;
      const authData = await AuthService.handleGoogleCallback(token);
      return this.convertToJson(res, 200, authData);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

}

module.exports = new AuthController();