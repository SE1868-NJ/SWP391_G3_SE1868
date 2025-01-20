const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthService = require('../services/authService');
require('dotenv').config({ path: './.env' });

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret:'',
    callbackURL: 'http://localhost:3000/auth/google/callback'
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
