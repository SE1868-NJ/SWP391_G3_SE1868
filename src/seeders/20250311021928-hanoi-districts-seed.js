'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [provinces] = await queryInterface.sequelize.query(
      `SELECT id FROM provinces WHERE name = 'Hà Nội'`
    );
    const hanoiId = provinces[0]?.id;

    if (!hanoiId) {
      console.error('Không tìm thấy tỉnh Hà Nội!');
      return;
    }

    await queryInterface.bulkInsert('districts', [
      {
        name: 'Ba Đình',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hoàn Kiếm',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tây Hồ',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Long Biên',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cầu Giấy',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Đống Đa',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hai Bà Trưng',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hoàng Mai',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thanh Xuân',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hà Đông',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bắc Từ Liêm',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nam Từ Liêm',
        province_id: hanoiId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    const [provinces] = await queryInterface.sequelize.query(
      `SELECT id FROM provinces WHERE name = 'Hà Nội'`
    );
    const hanoiId = provinces[0]?.id;

    if (hanoiId) {
      await queryInterface.bulkDelete('districts', { province_id: hanoiId }, {});
    }
  }
};
