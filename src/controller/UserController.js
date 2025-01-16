// const User = require('../models/user');
const UserService = require('../services/userService');
const BaseController = require('./BaseController');

class UserController extends BaseController {
    constructor() {
        super();
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return super.convertToJson(res, 200, users);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await UserService.getUserById(id);
            super.convertToJson(res, 200, user);
        } catch (error) {
            super.handleError(res, error);
        }
    }

    async updateUser(req, res) {
        const id = req.params.id;
        const user = req.body;
        
        try {
            const updatedUser = await UserService.updateUser(id, user);
            super.convertToJson(res, 200, updatedUser);
        } catch (error) {
            super.handleError(res, error);
        }
    }
}

module.exports = new UserController();