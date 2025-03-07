const db = require('../models');

class ShopRepository {
    constructor() { }

    async getShopById(shopId) {
        return await db.Shop.findByPk(shopId);
    }

    async getShopsByUserId(userId) {
        return await db.Shop.findAll({
            where: {
                user_id: userId
            }
        });
    }

    async getShopHomepage(shopId) {
        // Lấy thông tin cơ bản về shop
        const shop = await db.Shop.findByPk(shopId);
        if (!shop) return null;

        // Lấy số người theo dõi (nếu bảng Follow tồn tại)
        let followerCount = 0;
        try {
            if (db.Follow) {
                followerCount = await db.Follow.count({ where: { shop_id: shopId } });
            }
        } catch (error) {
            console.log("Không thể đếm followers:", error.message);
        }

        // Lấy số sản phẩm
        let productCount = 0;
        try {
            productCount = await db.Product.count({ where: { shop_id: shopId } });
        } catch (error) {
            console.log("Không thể đếm sản phẩm:", error.message);
        }

        // Lấy banner shop nếu có
        let banners = [];
        try {
            if (db.Banner) {
                banners = await db.Banner.findAll({
                    where: {
                        shop_id: shopId,
                        is_active: true
                    },
                    order: [['id', 'DESC']]
                });
            }
        } catch (error) {
            console.log("Không thể lấy banners:", error.message);
        }

        // Lấy danh mục sản phẩm
        let categories = [];
        try {
            categories = await db.Category.findAll();
        } catch (error) {
            console.log("Không thể lấy categories:", error.message);
        }

        return {
            shopInfo: {
                ...shop.toJSON(),
                follower_count: followerCount,
                product_count: productCount,
                average_rating: 4.4,  // Giá trị cứng tạm thời
                rating_count: 52700   // Giá trị cứng tạm thời
            },
            banners,
            categories
        };
    }

    async toggleFollowShop(userId, shopId) {
        try {
            const existingFollow = await db.Follow.findOne({
                where: {
                    user_id: userId,
                    shop_id: shopId
                }
            });

            if (existingFollow) {
                await existingFollow.destroy();
                return {
                    action: 'unfollow',
                    message: 'Đã hủy theo dõi shop'
                };
            } else {
                await db.Follow.create({
                    user_id: userId,
                    shop_id: shopId
                });
                return {
                    action: 'follow',
                    message: 'Đã theo dõi shop'
                };
            }
        } catch (error) {
            throw new Error(`Lỗi khi thao tác follow shop: ${error.message}`);
        }
    }

    async checkFollowStatus(userId, shopId) {
        try {
            const follow = await db.Follow.findOne({
                where: {
                    user_id: userId,
                    shop_id: shopId
                }
            });

            return !!follow;
        } catch (error) {
            throw new Error(`Lỗi khi kiểm tra trạng thái follow: ${error.message}`);
        }
    }
}

module.exports = new ShopRepository();