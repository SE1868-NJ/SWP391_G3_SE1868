const passport = require('passport');
const AuthService = require('../services/authService');
const BaseController = require('./baseController');

class AuthController extends BaseController {
  // Middleware cho login với Google
  // login = (req, res, next) => {
  //     console.log("Login request received");
  //     passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  //   };

  googleCallback(req, res) {
    try {
      const { token } = req.user;
      console.log(token);
      // const user = AuthService.findUserById(req.user.goole_id);
      // data = {
      //   token, 
      //   user
      // }
      // return this.convertToJson(res, 200, user);
      res.cookie('auth_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      res.redirect(`http://localhost:3000/api/user/getUsers`);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  }
}

module.exports = new AuthController();