const db = require('../models');

class WardRepository {
    constructor() {
    }
    async getWardsByDistrictId(districtId) {
        return db.Ward.findAll({
            where: {
                district_id: districtId
            }
        });
    }
}

module.exports = new WardRepository();