const { tr } = require('@faker-js/faker');
const db = require('../models');

class ProductRepository  {
    constructor() {
    }
    
    async getAllProduct(){
        try {
            return await db.Product.findAll();
        }
        catch (error) {
            throw error;
        }
    }

    async getAllProductByShopId(shopId){
        try {
            return await db.Product.findAll({
                where: { shop_id: shopId }
            });
        }
        catch (error) {
            throw error;
        }
    }

    async getProductById(id){
        try {
            return await db.Product.findByPk(id);
        }
        catch (error) {
            throw error;
        }
    }



    async create(product){
        try {
            return await db.Product.create(product);
        }
        catch (error) {
            throw error;
        }
    }

    async update(id, product){
        try {
            return await db.Product.update(product, {
                where: { id }
            });
        }
        catch (error) {
            throw error;
        }
    }

    async delete(id){
        try {
            return await db.Product.destroy({
                where: { id }
            });
        }
        catch (error) {
            throw error;
        }
    }


}

module.exports = new ProductRepository();