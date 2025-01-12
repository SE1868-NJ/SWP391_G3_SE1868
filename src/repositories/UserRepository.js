const db = require('../models');

class UserRepository {
    constructor() {
    }
    
    async getAllUsers() {
        try {
            const users = await db.User.findAll();
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await db.User.findByPk(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async createUser(user) {
        try {
            const newUser = await db.User.create(user);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(user) {
        try {
            const updatedUser = await db.User.update(user, {
                where: {
                    id: user.id,
                },
            });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new UserRepository();