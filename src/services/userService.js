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
        const user = await UserRepository.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await UserRepository.update(id, userData);
        if (!updatedUser) {
            throw new Error('User could not be updated');
        }
        return updatedUser;
    }
    
    async updateAvatar(id, avatarUrl) {
        try {
            const updatedUser = await UserRepository.update(id, { avatar: avatarUrl });

            if (!updatedUser || updatedUser[0] === 0) { 
                // updatedUser[0] === số hàng bị ảnh hưởng, nếu = 0 tức là không có user nào được cập nhật
                throw new Error('User not found or avatar not updated');
            }
            return { id, avatar: avatarUrl };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

}
module.exports = new UserService();