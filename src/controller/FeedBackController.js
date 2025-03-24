const feedbackService = require('../services/feedbackService');
const BaseController = require('./baseController');

class FeedBackController extends BaseController {

    // getFeedBacks = async (req, res) => {
    //     try {
    //         const params = { page: parseInt(req.body.page), product_id: parseInt(req.body.product_id) };

    //         const result = await feedbackService.getFeedBacks(params);
    //         this.convertToJson(res, 200, result);
    //     } catch (error) {
    //         this.handleError(res, error);
    //     }
    // }

    getFeedBacksByProductId = async (req, res) => {
        try {
            const product_id = parseInt(req.params.id);

            const result = await feedbackService.getFeedBacks(product_id);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

module.exports = new FeedBackController();