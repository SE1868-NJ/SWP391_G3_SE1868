const productRepository = require('../repositories/ProductRepository');
const categoryRepository = require('../repositories/CategoryRepository');
const cartRepository = require('../repositories/CartRepository');
const shopRepository = require('../repositories/ShopRepository');
const feedbackRepository = require('../repositories/FeedbackRepository');

class ProductService {
    constructor() {

    }
    async getAllProduct() {
        try {
            const dataProduct = await productRepository.getAllProduct();
            for (let data of dataProduct) {
                const category = await categoryRepository.getCategoryById(data.category_id);
                data.dataValues.category_id = category.dataValues;
            }
            return dataProduct;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProducts(params) {
        try {
            const result = await productRepository.getProducts(params);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const result = await productRepository.getProductById(id);
            if (result) {
                let ratingSum = 0;
                let rating = 0;
                const count_feedback = await feedbackRepository.countFeedbacksByProductId(id);
                const feedbacks = await feedbackRepository.getFeedBacksByProductId(id);

                feedbacks.items.forEach(feedback => {
                    ratingSum += feedback.rating;
                });
                if (feedbacks.items.length > 0) {
                    rating = Number((ratingSum / feedbacks.items.length).toFixed(1));
                }

                result.dataValues.rating = rating;
                result.dataValues.count_feedback = count_feedback;
            }
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async createCart(cart) {
        try {
            const cartExist = await cartRepository.getCartByUserAndProduct(cart.user_id, cart.product_id);
            if (cartExist) {
                cartExist.quantity += 1;
                const result = await cartRepository.updateCart(cartExist);
                return result;
            }
            const result = await cartRepository.createCart(cart);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getCountCartByUserId(userId) {
        try {
            const result = await cartRepository.getCountCartByUserId(userId);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new ProductService();