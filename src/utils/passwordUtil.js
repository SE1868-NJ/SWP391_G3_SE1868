const bcrypt = require('bcryptjs');

class PasswordUtil {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }
    
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = new PasswordUtil();