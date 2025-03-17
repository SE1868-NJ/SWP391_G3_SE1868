const db = require('../models');

class SupplierRepository {
    constructor() { }

    async getAllSuppliers() {
        return await db.Supplier.findAll();
    }

    async getSuppliers(params) {
        const { page = 1, limit = 10, status } = params;
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const { count, rows } = await db.Supplier.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });
        return {
            items: rows,
            metadata: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async getSupplierById(id) {
        return await db.Supplier.findByPk(id);
    }

    async createSupplier(data) {
        try {
            return await db.Supplier.create({
                supplier_id: data.supplier_id,
                supplier_code: data.supplier_code,
                supplier_name: data.supplier_name,
                delivery_time: data.delivery_time,
                bank_name: data.bank_name,
                account_number: data.account_number,
                payment_term: data.payment_term,
                address: data.address,
                contact_name: data.contact_name,
                phone_number: data.phone_number,
                facebook: data.facebook,
                note: data.note,
                status: data.status === 'Hoạt động' ? 'Hoạt động' : 'Không hoạt động',
            });
        } catch (error) {
            throw error;
        }
    }

    async updateSupplier(id, data) {
        const supplier = await db.Supplier.findByPk(id);
        if (!supplier) return null;

        await supplier.update(data);
        return supplier;
    }

    async deleteSupplier(id) {
        const supplier = await db.Supplier.findByPk(id);
        if (!supplier) return null;

        await supplier.destroy();
        return true;
    }
}

module.exports = new SupplierRepository();
