const db = require('../models');

class AddressRepository {
    constructor() {
    }
    async findAddressByUserId(userId) {
        return db.Address.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: db.Province,
                    as: 'province'
                },
                {
                    model: db.District,
                    as: 'district'
                },
                {
                    model: db.Ward,
                    as: 'ward'
                }
            ],
            order: [
                ['id', 'DESC'],
                ['created_at', 'DESC']
            ]
        })
    }

    async createAddress(address) {
        return db.Address.create(address);
    }

    async getAddressesByUserId(userId) {
        return db.Address.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: db.Province,
                    as: 'province'
                },
                {
                    model: db.District,
                    as: 'district'
                },
                {
                    model: db.Ward,
                    as: 'ward'
                }
            ],
            order: [
                ['id', 'DESC'],
                ['created_at', 'DESC']
            ]
        });
    }
}

module.exports = new AddressRepository();