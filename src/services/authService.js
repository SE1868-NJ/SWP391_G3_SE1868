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
}

module.exports = new AuthService();