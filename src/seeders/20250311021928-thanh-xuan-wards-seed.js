'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [districts] = await queryInterface.sequelize.query(
      `SELECT d.id 
       FROM districts d 
       JOIN provinces p ON d.province_id = p.id 
       WHERE p.name = 'Hà Nội' AND d.name = 'Thanh Xuân'`
    );
    
    const thanhXuanId = districts[0]?.id;

    if (!thanhXuanId) {
      console.error('Không tìm thấy quận Thanh Xuân!');
      return;
    }

    await queryInterface.bulkInsert('wards', [
      {
        name: 'Nhân Chính',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thượng Đình',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Khương Trung',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Khương Mai',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thanh Xuân Trung',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Phương Liệt',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hạ Đình',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Khương Đình',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thanh Xuân Bắc',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thanh Xuân Nam',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kim Giang',
        district_id: thanhXuanId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    const [districts] = await queryInterface.sequelize.query(
      `SELECT d.id 
       FROM districts d 
       JOIN provinces p ON d.province_id = p.id 
       WHERE p.code = 'Hà Nội' AND d.name = 'Thanh Xuân'`
    );
    
    const thanhXuanId = districts[0]?.id;

    if (thanhXuanId) {
      await queryInterface.bulkDelete('wards', { district_id: thanhXuanId }, {});
    }
  }
};
