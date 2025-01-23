const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AuthService = require('../services/authService');
require('dotenv').config({ path: './.env' });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email']
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            AuthService.handleFacebookLogin(profile)
                .then(token => {
                    return cb(null, token);
                })
                .catch(error => {
                    return cb(error, null);
                });
        } catch (err) {
            return cb(err);
        }
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


