const db = require('../models');

class VoucherRepository {
    constructor() { }

    async getVoucherByCode(code, storeId) {
        return db.Voucher.findOne({
            where: {
                code,
                shop_id: storeId,
                expiration_date: { [db.Sequelize.Op.gte]: new Date() }, // Kiểm tra voucher còn hạn
            },
            attributes: ['voucher_id', 'code', 'discount_rate', 'shop_id', 'expiration_date']
        });
    }

    async applyVoucherToCart(cartItemId, voucherId) {
        return db.CartVoucher.create({
            cart_id: cartItemId,
            voucher_id: voucherId,
        });
    }

    async getAppliedVouchers(cartItemId) {
        return db.CartVoucher.findAll({
            where: { cart_item_id: cartItemId },
            include: [{ model: db.Voucher, as: 'voucher' }],
        });
    }

    async removeVoucherFromCart(cartId, voucherId) {
        try {
            const deleted = await db.CartVoucher.destroy({
                where: { cart_id: cartId, voucher_id: voucherId }
            });
            if (deleted === 0) {
                throw new Error('Không tìm thấy bản ghi để xóa.');
            }
            return deleted;
        } catch (error) {
            throw new Error(`Không thể xóa voucher: ${error.message}`);
        }
    }
}

module.exports = new VoucherRepository();