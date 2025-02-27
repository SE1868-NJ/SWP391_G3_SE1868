'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            product_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'category_id',
                },
                onDelete: 'RESTRICT',
            },
            shop_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shops',
                    key: 'shop_id',
                },
                onDelete: 'CASCADE',
            },
            product_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            product_description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            SKU: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            import_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            sale_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            stock_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('products');
    },
};