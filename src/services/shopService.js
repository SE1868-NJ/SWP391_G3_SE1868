const shopRepository = require('../repositories/ShopRepository');
const productRepository = require('../repositories/ProductRepository');
const categoryRepository = require('../repositories/CategoryRepository');

class ShopService {
    constructor() { }

    async getShopsByUserId(userId) {
        try {
            return await shopRepository.getShopsByUserId(userId);
        } catch (error) {
            throw new Error(`Error getting shops for user: ${error.message}`);
        }
    }

    async updateShop(shopId, shopData) {
        try {
            return await shopRepository.updateShop(shopId, shopData);
        } catch (error) {
            throw new Error(`Error updating shop: ${error.message}`);
        }
    }

    async getShopHomepage(shopId) {
        try {
            const shop = await shopRepository.getShopById(shopId);
            if (!shop) {
                throw new Error('Shop not found');
            }
            // Lấy số lượng sản phẩm
            const productCount = await productRepository.countShopProducts(shopId);

            // Lấy thông tin đánh giá từ DB
            const ratings = await shopRepository.getShopRatings(shopId);

            // Lấy danh mục sản phẩm của shop
            const categories = await categoryRepository.getCategoriesByShopId(shopId);

            return {
                shopInfo: {
                    ...shop.toJSON(),
                    product_count: productCount,
                    average_rating: ratings.average_rating,
                    rating_count: ratings.rating_count
                },
                categories: categories
            };
        } catch (error) {
            throw new Error(`Error getting shop homepage: ${error.message}`);
        }
    }

    async getProductsByShopAndCategory(params) {
        try {
            return await productRepository.getProductsByShopAndCategory(params);
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`);
        }
    }

    async getFeedbacksByShop(shopId, startDate, endDate) {
        try {
            return await shopRepository.getFeedbacksByShop(shopId, startDate, endDate);
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách đánh giá: ${error.message}`);
        }
    }

}

module.exports = new ShopService();