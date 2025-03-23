// controller/authController.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Lấy JWT secret từ biến môi trường hoặc sử dụng giá trị mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

const authController = {
	// Đăng nhập người dùng
	login: async (req, res) => {
		try {
			// Kiểm tra dữ liệu gửi lên từ client
			console.log("🔍 Request body:", req.body);

			const { email, password } = req.body;

			// Kiểm tra nếu không có email hoặc password
			if (!email || !password) {
				console.log("⚠️ Thiếu email hoặc mật khẩu");
				return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
			}

			// Tìm người dùng trong database
			const user = await User.findOne({ where: { email } });

			console.log("🔍 Tìm user theo email:", user);

			if (!user) {
				console.log("❌ Không tìm thấy user với email:", email);
				return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
			}

			// Kiểm tra mật khẩu
			console.log("🔍 Mật khẩu nhập vào:", password);
			console.log("🔍 Mật khẩu trong database:", user.password);

			const isPasswordValid = await bcrypt.compare(password, user.password);
			console.log("🔍 Mật khẩu hợp lệ?", isPasswordValid);

			if (!isPasswordValid) {
				console.log("❌ Sai mật khẩu");
				return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
			}

			// Tạo JWT token
			// Tạo JWT token (Lưu ý: dùng user.userID thay vì user.id)
			// Tạo JWT token (đảm bảo dùng `userID` đúng với Sequelize model)
			const token = jwt.sign(
				{ userID: user.userID, email: user.email }, // ⚠ Đúng tên field trong model Sequelize
				JWT_SECRET,
				{ expiresIn: '24h' }
			);



			// Loại bỏ mật khẩu khỏi response
			const { password: _, ...userWithoutPassword } = user.toJSON();

			console.log("✅ Đăng nhập thành công:", userWithoutPassword);

			return res.status(200).json({
				user: userWithoutPassword,
				token
			});
		} catch (error) {
			console.error("❌ Lỗi khi đăng nhập:", error);
			return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
		}
	},


	// Lấy thông tin người dùng hiện tại
	getCurrentUser: async (req, res) => {
		try {
			console.log("🔍 User từ middleware:", req.user);

			// Lấy user bằng userID
			const user = await User.findByPk(req.user.userID, {
				attributes: { exclude: ['password'] }
			});

			if (!user) {
				return res.status(404).json({ message: "Không tìm thấy người dùng" });
			}

			return res.status(200).json(user);
		} catch (error) {
			console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
			return res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng" });
		}
	}

};

module.exports = authController;