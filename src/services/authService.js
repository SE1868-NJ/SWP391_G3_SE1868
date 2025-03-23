const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const PasswordUtil = require('../utils/passwordUtil');

class AuthService {
	async handleGoogleAuth(profile) {
		const user = await UserRepository.findOrCreateGoogleUser(profile);
		return this.generateToken(user);
	}

	generateToken(user) {
		return jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);
	}

	async findUserById(id) {
		try {
			const user = await UserRepository.getUserById(id);
			return user;
		} catch (error) {
			throw error;
		}
	}

	handleAuthCallback = async (token) => {
		try {
			if (!token) {
				throw new Error('Authentication failed: No token provided');
			}
			let decodedToken;
			try {
				decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			} catch (err) {
				throw new Error('Invalid token: ' + err.message);
			}

			const user = await this.findUserById(decodedToken.id);
			if (!user) {
				throw new Error('User not found');
			}

			return {
				token: token,
				user: user,
			};
		} catch (error) {
			throw error;
		}
	};

	async handleFacebookLogin(profile) {
		let user = await UserRepository.findByFacebookId(profile.id);
		if (!user) {
			user = await UserRepository.create({
				facebook_id: profile.id,
				name: profile.displayName,
				email: profile.emails?.[0]?.value || null,
			});
		}
		return this.generateToken(user);
	}

	async register(userData) {
		try {
			const { password, email, ...otherData } = userData;

			const user = await UserRepository.findByEmail(email);
			if (user) {
				throw new Error('User already exists');
			}
			const passwordHash = await PasswordUtil.hashPassword(password);

			const newUser = await UserRepository.create({
				...otherData,
				email: email,
				password: passwordHash,
			});

			return newUser;
		} catch (error) {
			throw error;
		}
	}

	async login(email, password) {
		try {
			const user = await UserRepository.findByEmail(email);
			if (!user) {
				throw new Error('User not found');
			}

			const isPasswordMatch = await PasswordUtil.comparePassword(
				password,
				user.password
			);
			if (!isPasswordMatch) {
				throw new Error('Incorrect password');
			}
			const token = this.generateToken(user);

			return {
				token: token,
				user: user,
			};
		} catch (error) {
			throw error;
		}
	}

	async getCurrentUser(userId) {
		try {
			// Sử dụng UserRepository để lấy thông tin người dùng
			const user = await UserRepository.getUserById(userId);

			if (!user) {
				throw new Error('Không tìm thấy người dùng');
			}

			return user;
		} catch (error) {
			console.error('Get current user error:', error);
			throw error;
		}
	}
}

module.exports = new AuthService();
