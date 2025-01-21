const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthService = require('../services/authService');
require('dotenv').config({ path: './.env' });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {  // Sử dụng function thay vì arrow function
        try {
            AuthService.handleGoogleAuth(profile)
                .then(token => {
                    return cb(null, { token });
                })
                .catch(error => {
                    return cb(error, null);
                });
        } catch (error) {
            return cb(error, null);
        }
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
;
