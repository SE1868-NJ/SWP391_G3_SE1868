const UserRepository = require('../repositories/userRepository');

class AuthService {
    async loginWithGoogle(profile) {
        console.log(profile);

        const userData = {
            // google_id : profile.id,
            // name: profile.name.givenName,
            // email: profile.emails[0].value
        }
        try {
            const [user, create] = await UserRepository.findOrCreateUser(userData);
            return user;
        } catch (error) {
            throw error;
        }
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