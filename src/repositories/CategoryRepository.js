const db = require('../models');

class CategoryRepository  {
    constructor() {
    }
    
    async getAllCategory(){
        return await db.category.findAll();
    }

    async getCategoryById(id){
        return await db.category.findByPk(id);
    }
}

module.exports = new CategoryRepository();