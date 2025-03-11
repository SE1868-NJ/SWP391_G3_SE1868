const db = require('../models');

class DistrictRepository {
    constructor() {
    }
    async getDistrictsByProvinceId(provinceId) {
        return db.District.findAll({
            where: {
                province_id: provinceId
            }
        });
    }
}
module.exports = new DistrictRepository();