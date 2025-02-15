const db = require('../models');

class CategoryRepository  {
    constructor() {
    }
    
    async getAllCategory(){
        return await db.Category.findAll();
    }

    async getCategoryById(id){
        return await db.Category.findByPk(id);
    }
}

module.exports = new CategoryRepository();