const categoryRepository = require('../repositories/CategoryRepository');

class CategoryService {
    constructor() {

    }
    async getAllCategory() {
        try {
            return await categoryRepository.getAllCategory();
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new CategoryService();