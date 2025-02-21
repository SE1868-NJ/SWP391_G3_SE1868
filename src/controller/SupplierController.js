const supplierService = require('../services/supplierService');
const BaseController = require('./baseController');

class SupplierController extends BaseController {

    getAllSuppliers = async (req, res) => {
        try {
            const suppliers = await supplierService.getAllSuppliers();
            return this.convertToJson(res, 200, suppliers);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // getSuppliers = async (req, res) => {
    //     try {
    //         const params = {
    //             page: parseInt(req.query.page) || 1,
    //             limit: parseInt(req.query.limit) || 10
    //         };

    //         const result = await supplierService.getSuppliers(params);
    //         return this.convertToJson(res, 200, result);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }

    getSupplierById = async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const result = await supplierService.getSupplierById(id);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    createSupplier = async (req, res) => {
        try {
            const supplierData = req.body;

            const result = await supplierService.createSupplier(supplierData);
            return this.convertToJson(res, 201, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    updateSupplier = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updateData = req.body;

            const result = await supplierService.updateSupplier(id, updateData);
            return this.convertToJson(res, 200, { message: 'Cập nhật thành công!', result });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    deleteSupplier = async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            await supplierService.deleteSupplier(id);
            return this.convertToJson(res, 200, { message: 'Xóa thành công!' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

module.exports = new SupplierController();
