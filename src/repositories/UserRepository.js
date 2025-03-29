const db = require('../models');

class UserRepository {
    constructor() { }

    async getAll() {
        try {
            const users = await db.User.findAll({
                attributes: ['user_id', 'full_name', 'email', 'phone', 'gender', 'avatar'],
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await db.User.findByPk(id, {
                attributes: ['user_id', 'full_name', 'email', 'phone', 'gender', 'avatar'],
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const user = await db.User.findByPk(id);
            if (!user) throw new Error('User not found');

            return await user.update(userData);
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await db.User.findOne({
                where: { email: email }
            });
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

    async findByFacebookId(facebookId) {
        try {
            return await db.User.findOne({
                where: { facebook_id: facebookId }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();