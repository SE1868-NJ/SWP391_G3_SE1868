const UserRepository = require('../repositories/userRepository');

class UserService {
    constructor() {
    }

    async getAllUsers() {
        try {
            const users = await UserRepository.getAll();
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
            const user = await UserRepository.getUserById(id);
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
          const updatedUser = await UserRepository.update(id, userData);
          if (!updatedUser) {
            throw new Error('User not found or could not be updated');
          }
          return updatedUser;
        } catch (error) {
          throw new Error(`Error: ${error.message}`);
        }
      }

}
module.exports = new UserService();