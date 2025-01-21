// const User = require('../models/user');
const UserService = require('../services/userService');
const BaseController = require('./baseController');

class UserController extends BaseController {
    constructor() {
        super();
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            return this.convertToJson(res, 200, users);z
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getUserById = async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserService.getUserById(id);
            return this.convertToJson(res, 200, user);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateUser = async (req, res) => {
        const id = req.params.id;
        const user = req.body;

        try {
            const updatedUser = await UserService.updateUser(id, user);
            return this.convertToJson(res, 200, updatedUser);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new UserController();