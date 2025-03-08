const shopRepository = require('../repositories/ShopRepository');
const bannersRepository = require('../repositories/BannerRepository');
const followRepository = require('../repositories/FollowRepository');
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

            // Lấy thông tin bổ sung song song để tối ưu hiệu suất
            const [followerCount, productCount, banners, categories] = await Promise.all([
                followRepository.countShopFollowers(shopId),
                productRepository.countShopProducts(shopId),
                bannersRepository.getActiveShopBanners(shopId),
                categoryRepository.getAllCategory()
            ]);
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

    // async checkFollowStatus(userId, shopId) {
    //     try {
    //         const follow = await shopRepository.findFollowRelation(userId, shopId);
    //         return !!follow;
    //     } catch (error) {
    //         throw new Error(`Error checking follow status: ${error.message}`);
    //     }
    // }

    // async toggleFollowShop(userId, shopId) {
    //     try {
    //         const existingFollow = await shopRepository.findFollowRelation(userId, shopId);

    //         if (existingFollow) {
    //             await shopRepository.deleteFollowRelation(existingFollow);
    //             return {
    //                 action: 'unfollow',
    //                 message: 'Đã hủy theo dõi shop'
    //             };
    //         } else {
    //             await shopRepository.createFollowRelation(userId, shopId);
    //             return {
    //                 action: 'follow',
    //                 message: 'Đã theo dõi shop'
    //             };
    //         }
    //     } catch (error) {
    //         throw new Error(`Error toggling shop follow: ${error.message}`);
    //     }
    // }
}

module.exports = new ShopService();