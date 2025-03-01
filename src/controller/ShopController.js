const categoryService = require("../services/categoryService");
const productService = require("../services/productService");
const BaseController = require("./baseController");

class ShopController extends BaseController {
  getCategory = async (req, res) => {
    try {
      const categories = await categoryService.getAllCategory();
      return this.convertToJson(res, 200, categories);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getAllProduct = async (req, res) => {
    try {
      const products = await productService.getAllProduct();
      return this.convertToJson(res, 200, products);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getProducts = async (req, res) => {
    try {
      const params = {
        page: parseInt(req.body.page),
        limit: parseInt(req.body.limit) || 4, // Giữ nguyên mặc định nếu không có limit
        search: req.body.search || "", // Lấy thêm search từ body
        sortPrice: req.body.sortPrice || "asc", // Lấy thêm sortPrice từ body
      };

      const result = await productService.getProducts(params);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  //   getTopSearchedProducts = async (req, res) => {
  //     try {
  //       const limit = parseInt(req.query.limit) || 5; // Lấy limit từ query hoặc mặc định là 5
  //       const result = await productService.getMostSearchedProducts(limit);
  //       this.convertToJson(res, 200, result);
  //     } catch (error) {
  //       this.handleError(res, error);
  //     }
  //   };
  //   increaseSearchCount = async (req, res) => {
  //     try {
  //         const productId = parseInt(req.params.id);
  //         await productService.increaseSearchCount(productId);
  //         this.convertToJson(res, 200, { message: "Search count updated" });
  //     } catch (error) {
  //         this.handleError(res, error);
  //     }
  // };

  getProductById = async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Tăng search_count và lấy dữ liệu sản phẩm
      await productService.increaseSearchCount(id);
      const result = await productService.getProductById(id);

      if (!result) {
        return this.convertToJson(res, 404, { message: "Product not found" });
      }

      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getProductByName = async (req, res) => {
    try {
      const productName = req.params.name;

      const result = await productService.getProductByName(productName);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getCartsByUserId = async (req, res) => {
    try {
      const userId = req.params.id;

      const result = await productService.getCartsByUserId(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = req.body;

      const result = await productService.createCart(cart);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getCountCartByUserId = async (req, res) => {
    try {
      const userId = req.params.id;

      const result = await productService.getCountCartByUserId(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };
  getTopSearchedProducts = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 4; // Mặc định là 4 sản phẩm

      const result = await productService.getMostSearchedProducts(limit);
      return this.convertToJson(res, 200, result);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  increaseSearchCount = async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      await productService.increaseSearchCount(productId);
      return this.convertToJson(res, 200, { message: "Search count updated" });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = new ShopController();
