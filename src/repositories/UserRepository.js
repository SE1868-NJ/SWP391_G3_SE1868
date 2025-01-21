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

    async findOrCreateGoogleUser(profile) {
        const [user, created] = await this.db.User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            email: profile.emails[0].value,
            name: profile.displayName,
          }
        });
        return user;
      }
}

module.exports = new UserRepository();