const db = require('../models');

class ProvinceRepository {
    constructor() {
    }
    async getAllProvinces() {
        return db.Province.findAll();
    }
}
module.exports = new ProvinceRepository();