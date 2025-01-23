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
                where: { id }
            });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async findByGoogleId(googleId) {
        try {
            return await db.User.findOne({
                where: { google_id: googleId }
            });
        } catch (error) {
            throw error;
        }
    }

    async createWithGoogle(profile) {
        try {
            return await db.User.create({
                google_id: profile.id,
                email: profile.email,
                name: profile.displayName,
            });
        } catch (error) {
            throw error;
        }
    }

    findByFacebookId(facebookId) {
        try {
            return db.User.findOne({
                where: { facebook_id: facebookId }
            });
        } catch (error) {
            throw error;
        }
    }

    async findOrCreateGoogleUser(profile) {
        try {
            let user = await this.findByGoogleId(profile.id);

            if (!user) {
                user = await this.createWithGoogle(profile);
            }

            return user;
        } catch (error) {
            throw new Error('Error handling Google user: ' + error.message);
        }
    }
}

module.exports = new UserRepository();