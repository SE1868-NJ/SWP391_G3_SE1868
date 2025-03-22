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
            if (!shop) return null;
            const [productCount, categories] = await Promise.all([
                productRepository.countShopProducts(shopId),
                categoryRepository.getCategoriesWithProductCount(shopId)
            ]);
            return {
                shopInfo: {
                    ...shop.toJSON(),
                    product_count: productCount,
                    average_rating: 4.4,
                    rating_count: 52700
                },
                categories
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