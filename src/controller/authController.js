const passport = require('passport');
const AuthService = require('../services/authService');

class AuthController {
    // Middleware cho login với Google
    login = (req, res, next) => {
        console.log("Login request received");
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
      };

    googleCallback = (req, res, next) => {
        console.log("Google callback received");
        passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
          console.log("Authentication successful");
          res.redirect('/');
        });
      };
}

module.exports = new AuthController();