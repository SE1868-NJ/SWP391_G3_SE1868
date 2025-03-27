const productService = require('../services/productService');
const BaseController = require('./baseController');

class ProductController extends BaseController {
	getTopSearchedProducts = async (req, res) => {
		try {
			const limit = parseInt(req.query.limit) || 4;

			const result = await productService.getMostSearchedProducts(limit);
			return this.convertToJson(res, 200, result);
		} catch (error) {
			return this.handleError(res, error);
		}
	};

	async getTopProducts(req, res) {
		try {
			const { sortBy, limit } = req.query;
			if (!limit) {
				return res.status(400).json({ status: 'error', message: 'Limit is required' });
			}
			let topProducts;
			if (sortBy === 'quantity') {
				topProducts = await productService.getTopProductsByQuantity(limit);
			} else if (sortBy === 'revenue') {
				topProducts = await productService.getTopProductsByRevenue(limit);
			} else {
				return res.status(400).json({ status: 'error', message: 'Invalid sortBy value' });
			}
			return res.status(200).json({ status: 'success', data: topProducts });
		} catch (error) {
			return res.status(500).json({ status: 'error', message: 'Error fetching top products' });
		}
	}
}

module.exports = new ProductController();
