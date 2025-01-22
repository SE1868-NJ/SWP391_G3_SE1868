const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

class AuthService {

    async handleGoogleAuth(profile) {
        const user = await UserRepository.findOrCreateGoogleUser(profile);
        return this.generateToken(user);
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async findUserById(id) {
        try {
            const user = await UserRepository.getUserById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    handleGoogleCallback = async (token) => {
        try {
            if (!token) {
                throw new Error('Authentication failed: No token provided');
            }
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                throw new Error('Invalid token: ' + err.message);
            }

            const user = await this.findUserById(decodedToken.id);
            if (!user) {
                throw new Error('User not found');
            }

            return {
                token: token,
                user: user
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();