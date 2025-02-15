const db = require('../models');

class ProductRepository  {
    constructor() {
    }
    
    async getAllProduct(){
        return await db.Product.findAll();
    }
}

module.exports = new ProductRepository();