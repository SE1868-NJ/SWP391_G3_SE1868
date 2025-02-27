'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vouchers', {
            voucher_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
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
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            discount_rate: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            max_discount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            expiration_date: {
                type: Sequelize.DATE,
                allowNull: false,
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
        await queryInterface.dropTable('vouchers');
    },
};