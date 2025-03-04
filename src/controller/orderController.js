const orderService = require('../services/orderService');
const BaseController = require('./baseController');

class OrderController extends BaseController {
    
    createOrder = async (req, res) => {
        try {
            const order = req.body;

            const result = await orderService.createOrder(order);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getOrdersByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await orderService.getOrdersByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

module.exports = new OrderController();