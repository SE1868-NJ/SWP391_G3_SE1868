const supplierRepository = require('../repositories/SupplierRepository');

class SupplierService {
    constructor() { }

    async getAllSuppliers(shopId) {
        try {
            const suppliers = await supplierRepository.getAllSuppliers(shopId);
            return suppliers;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getSuppliers(params) {
        try {
            const result = await supplierRepository.getSuppliers(params);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getSupplierById(id, shopId) {
        try {
            const supplier = await supplierRepository.getSupplierById(id, shopId);
            if (!supplier) throw new Error('Nhà cung cấp không tồn tại!');
            return supplier;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async createSupplier(supplierData) {
        try {
            const newSupplier = await supplierRepository.createSupplier(supplierData);
            return newSupplier;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async updateSupplier(id, updateData, shopId) {
        try {
            const updatedSupplier = await supplierRepository.updateSupplier(id, updateData, shopId);
            if (!updatedSupplier) throw new Error('Nhà cung cấp không tồn tại!');
            return updatedSupplier;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async deleteSupplier(id, shopId) {
        try {
            const deleted = await supplierRepository.deleteSupplier(id, shopId);
            if (!deleted) throw new Error('Nhà cung cấp không tồn tại!');
            return { message: 'Xóa nhà cung cấp thành công!' };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new SupplierService();