const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthService = require('../services/authService');
require('dotenv').config({ path: './.env' });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const token = await AuthService.handleGoogleAuth(profile);
            done(null, { token });
        } catch (error) {
            done(error, null);
        }
    }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
;
