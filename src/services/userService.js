const userRepository = require('../repositories/userRepository');

class UserService {
    constructor() { }

    async getAllUsers() {
        try {
            const users = await userRepository.getAll();
            if (!users) {
                throw new Error('No users found');
            }
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserById(id) {
        try {
            const user = await userRepository.getUserById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUser(id, userData) {
        try {
            // Update the user first
            await userRepository.update(id, userData);

            // Then get the updated user to return
            const updatedUser = await userRepository.getUserById(id);

            if (!updatedUser) {
                throw new Error('User not found or could not be updated');
            }

            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
}

module.exports = new UserService();