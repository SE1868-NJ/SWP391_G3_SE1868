const db = require('../models');

class UserRepository {
    constructor() {
    }

    async getAll() {
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

    async create(user) {
        try {
            const newUser = await db.User.create(user);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async update(id, user) {
        try {
            const updatedUser = await db.User.update(user, {
                where: {
                    id: id,
                },
            });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async findOrCreateUser(userData) {
        return await User.findOrCreate({
            where: { googleId: userData.googleId },
            defaults: userData,
        });
    }
}

module.exports = new UserRepository();