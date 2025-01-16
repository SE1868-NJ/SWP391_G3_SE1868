const UserRepository = require('../repositories/userRepository');

class UserService {
    constructor() {
    }

    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    async getUserById(id) {
        return await UserRepository.getUserById(id);
    }

    async createUser(user) {
        return await UserRepository.createUser(user);
    }

    async updateUser(id, userData) {
        const user = await UserRepository.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await UserRepository.updateUser(id, userData);
        if (!updatedUser) {
            throw new Error('User could not be updated');
        }
        return updatedUser;
    }

}
module.exports = new UserService();