const passport = require('passport');
const AuthService = require('../services/authService');

class AuthController {
    // Middleware cho login với Google
    login = (req, res, next) => {
        console.log("Login request received");
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
      };

      googleCallback(req, res) {
        const { token } = req.user;
        res.redirect(`http://localhost:3000/auth/google/callback?token=${token}`);
      }
}

module.exports = new AuthController();