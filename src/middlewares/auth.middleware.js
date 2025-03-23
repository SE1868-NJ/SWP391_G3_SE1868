const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔍 Token nhận được:", token);

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("🔍 Dữ liệu giải mã từ token:", decoded);

        // Dùng `userID` thay vì `id`
        const user = await User.findByPk(decoded.userID);

        console.log("🔍 User tìm được trong DB:", user);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Lỗi xác thực:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { authMiddleware };
