const supplierService = require('../services/supplierService');
const BaseController = require('./baseController');

class SupplierController extends BaseController {
    getAllSuppliers = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const shopId = req.user.shop_id;
            const suppliers = await supplierService.getAllSuppliers(shopId);
            return this.convertToJson(res, 200, suppliers);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getSuppliers = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const shopId = req.user.shop_id;
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                status: req.query.status,
                shopId,
            };
            const result = await supplierService.getSuppliers(params);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getSupplierById = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const id = parseInt(req.params.id);
            const shopId = req.user.shop_id;
            const result = await supplierService.getSupplierById(id, shopId);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    createSupplier = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const supplierData = {
                ...req.body,
                shop_id: req.user.shop_id,
            };
            const result = await supplierService.createSupplier(supplierData);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateSupplier = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const id = parseInt(req.params.id);
            const shopId = req.user.shop_id;
            const updateData = req.body;
            const result = await supplierService.updateSupplier(id, updateData, shopId);
            return this.convertToJson(res, 200, { message: 'Cập nhật thành công!', result });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    deleteSupplier = async (req, res) => {
        try {
            if (!req.user || !req.user.shop_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: shop_id is missing.',
                });
            }
            const id = parseInt(req.params.id);
            const shopId = req.user.shop_id;
            await supplierService.deleteSupplier(id, shopId);
            return this.convertToJson(res, 200, { message: 'Xóa thành công!' });
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new SupplierController();