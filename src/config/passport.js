const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthService = require('../services/authService');
require('dotenv').config({ path: './.env' });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (token, tokenSecret, profile, done) => {
        try {
            const user = await AuthService.loginWithGoogle(profile);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await AuthService.findUserById(id);
        done(null, user);  // Đảm bảo trả về đúng user
    } catch (error) {
        done(error, null);
    }
});
