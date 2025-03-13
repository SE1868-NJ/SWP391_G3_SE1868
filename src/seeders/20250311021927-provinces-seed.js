'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('provinces', [
      {
        name: 'Hà Nội',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hồ Chí Minh',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Đà Nẵng',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hải Phòng',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cần Thơ',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'An Giang',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bà Rịa - Vũng Tàu',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bắc Giang',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bắc Kạn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bạc Liêu',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('provinces', null, {});
  }
};
