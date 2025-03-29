const productRepository = require("../repositories/ProductRepository");
const categoryRepository = require("../repositories/CategoryRepository");
const cartRepository = require("../repositories/CartRepository");
const shopRepository = require("../repositories/ShopRepository");
const feedbackRepository = require("../repositories/FeedbackRepository");

class ProductService {
  constructor() { }
  async getAllProduct() {
    try {
      const dataProduct = await productRepository.getAllProduct();
      for (let data of dataProduct) {
        const category = await categoryRepository.getCategoryById(
          data.category_id
        );
        data.dataValues.category_id = category.dataValues;
      }
      return dataProduct;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getProducts(params) {
    try {
      const { page, limit, search, sortPrice, categories, minPrice, maxPrice } = params;
      // Truyền đầy đủ các tham số xuống Repository
      const result = await productRepository.getProducts({
        page,
        limit,
        search,
        sortPrice,
        categories: categories ? categories.split(',') : [],  // tách categories từ chuỗi thành mảng
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const result = await productRepository.getProductById(id);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getCartsByUserId(userId) {
    try {
      const result = await cartRepository.getCartsByUserId(userId);

      const shopGroupedCarts = result.reduce((acc, cartItem) => {
        const shopId = cartItem.product.shop_id;

        if (!acc[shopId]) {
          acc[shopId] = {
            shop_info: null,
            items: [],
          };
        }

        acc[shopId].items.push({
          cart_id: cartItem.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          product: {
            id: cartItem.product.id,
            product_name: cartItem.product.product_name,
            product_description: cartItem.product.product_description,
            image_url: cartItem.product.image_url,
            sale_price: cartItem.product.sale_price,
            stock_quantity: cartItem.product.stock_quantity,
            category: cartItem.product.category,
          },
        });

        return acc;
      }, {});

      for (const shopId in shopGroupedCarts) {
        const shop = await shopRepository.getShopById(parseInt(shopId));
        shopGroupedCarts[shopId].shop_info = {
          shop_id: shop.shop_id,
          shop_name: shop.shop_name,
          shop_logo: shop.shop_logo,
          shop_address: shop.shop_address,
        };
      }

      const formattedResult = Object.values(shopGroupedCarts);

      return formattedResult;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async createCart(cart) {
    try {
      const cartExist = await cartRepository.getCartByUserAndProduct(
        cart.user_id,
        cart.product_id
      );
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
  async getProductByName(productName) {
    try {
      const result = await productRepository.getProductByName(productName);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  async increaseSearchCount(productId) {
    try {
      await productRepository.updateSearchCount(productId);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getMostSearchedProducts(limit = 4) {
    try {
      // Loại bỏ tham số searchCount không cần thiết
      return await productRepository.getMostSearchedProducts(limit);
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
  async getProductByName(productName) {
    try {
      const result = await productRepository.getProductByName(productName);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  async increaseSearchCount(productId) {
    try {
      await productRepository.updateSearchCount(productId);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getMostSearchedProducts(limit = 4) {
    try {
      return await productRepository.getMostSearchedProducts(limit);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getProductsByShopAndCategory(params) {
    try {
      const { shopId, categoryId, sort } = params;

      const products = await productRepository.getProductsByShopAndCategory(
        shopId, categoryId, sort
      );

      const productsWithDetails = await Promise.all(products.map(async product => {
        // Lấy đánh giá trung bình và số lượng đánh giá
        const feedbackStats = await feedbackRepository.getProductFeedbackStats(product.id);

        // Lấy số lượng đã bán
        const soldCount = await productRepository.getProductSoldCount(product.id);

        let discountPercent = 0;
        if (product.import_price && product.import_price > product.sale_price) {
          discountPercent = Math.round(((product.import_price - product.sale_price) / product.import_price) * 100);
        }

        return {
          ...product.toJSON(),
          average_rating: parseFloat(feedbackStats.average_rating || 0),
          sold_count: soldCount,
          discount_percent: discountPercent
        };
      }));

      return {
        products: productsWithDetails
      };
    } catch (error) {
      throw new Error(`Error getting products by shop and category: ${error.message}`);
    }
  }

  async getTopProductsByQuantity(limit = 5) {
    try {
      const topProducts = await productRepository.getTopProductsByQuantity(limit);
      return topProducts;
    } catch (error) {
      throw error;
    }
  }

  async getTopProductsByRevenue(limit = 5) {
    try {
      const topProducts = await productRepository.getTopProductsByRevenue(limit);
      return topProducts;
    } catch (error) {
      throw error;
    }
  }


}
module.exports = new ProductService();
