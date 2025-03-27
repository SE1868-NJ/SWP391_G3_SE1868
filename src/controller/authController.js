const passport = require('passport');
const AuthService = require('../services/authService');
const BaseController = require('./baseController');

class AuthController extends BaseController {
	// Middleware cho login với Google
	loginGoogle = (req, res, next) => {
		passport.authenticate('google', { scope: ['profile', 'email'] })(
			req,
			res,
			next
		);
	};

	googleCallback = async (req, res) => {
		try {
			const { token } = req.user;
			const authData = await AuthService.handleAuthCallback(token);
			return this.convertToJson(res, 200, authData);
		} catch (error) {
			return this.handleError(res, error);
		}
	};

	loginFacebook = (req, res) =>
		passport.authenticate('facebook', { scope: ['email'] })(req, res);

	facebookCallback = async (req, res) => {
		try {
			const token = req.user;
			const authData = await AuthService.handleAuthCallback(token);
			return this.convertToJson(res, 200, authData);
		} catch (error) {
			return this.handleError(res, error);
		}
	};

	register = async (req, res) => {
		try {
			const userData = req.body;

			const user = await AuthService.register(userData);
			return this.convertToJson(res, 200, user);
		} catch (error) {
			return this.handleError(res, error);
		}
	};

	login = async (req, res) => {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({
					success: false,
					message: 'Email và mật khẩu không được để trống!',
				});
			}
			const data = await AuthService.login(email, password);
			return this.convertToJson(res, 200, data);
		} catch (error) {
			return this.handleError(res, error);
		}
	};

	getCurrentUser = async (req, res) => {
		try {
			if (!req.user || !req.user.id) { // Kiểm tra req.user.id (ID từ token)
				return res.status(401).json({
					success: false,
					message: 'Unauthorized: user_id is missing.',
				});
			}
			const userId = req.user.id;
			const userData = await AuthService.getCurrentUser(userId);
			if (!userData) {
				return res.status(404).json({
					success: false,
					message: 'Không tìm thấy người dùng!',
				});
			}
			return this.convertToJson(res, 200, userData);
		} catch (error) {
			return this.handleError(res, error);
		}
	};
}

module.exports = new AuthController();