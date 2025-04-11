const UserRepository = require('../repositories/userRepository');
const ShopRepository = require('../repositories/shopRepository');
const jwt = require('jsonwebtoken');
const PasswordUtil = require('../utils/passwordUtil');

class AuthService {
	async handleGoogleAuth(profile) {
		const user = await UserRepository.findOrCreateGoogleUser(profile);
		return this.generateToken(user);
	}

	generateToken(user, shopId) {
		return jwt.sign(
			{ id: user.userID, email: user.email, shop_id: shopId },
			process.env.JWT_SECRET,
			{ expiresIn: '30m' }
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

			// Tạo shop cho user mới
			const shop = await ShopRepository.findOrCreateShopByUserId(newUser.userID, newUser.name);

			// Tạo token với shop_id
			const token = this.generateToken(newUser, shop.shop_id);
			return { user: newUser, token };
		} catch (error) {
			throw error;
		}
	}

	// Basic Login
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
			// if (!isPasswordMatch) {
			// 	throw new Error('Incorrect password');
			// }

			// Sử dụng ShopRepository để tìm hoặc tạo shop
			const shop = await ShopRepository.findOrCreateShopByUserId(user.userID, user.name);
			if (!shop) {
				throw new Error('Shop not found for this user');
			}

			const token = this.generateToken(user, shop.shop_id);
			return {
				token: token,
				user: user,
				shop_id: shop.shop_id,
			};
		} catch (error) {
			throw error;
		}
	}

	async getCurrentUser(userId) {
		try {
			const user = await UserRepository.getUserById(userId);
			if (!user) {
				throw new Error('Không tìm thấy người dùng');
			}

			// Chuyển user thành plain object
			const userData = user.toJSON ? user.toJSON() : user;

			// Lấy thông tin shop của user
			const shop = await ShopRepository.findOrCreateShopByUserId(userData.user_id, userData.full_name);
			if (!shop) {
				throw new Error('Shop not found for this user');
			}

			// Thêm shop_id vào dữ liệu trả về
			return {
				...userData,
				shop_id: shop.shop_id,
			};
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new AuthService();