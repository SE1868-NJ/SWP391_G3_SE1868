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

}

module.exports = new ShopService();