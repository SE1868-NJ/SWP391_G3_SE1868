'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const users = [];
		let gender = 1;
		for (let i = 0; i < 10; i++) {
			users.push({
				name: faker.person.fullName(),
				gender: gender === 1 ? 'male' : gender === 2 ? 'female' : 'other',
				date_of_birth: faker.date.birthdate(),
				phone: faker.phone.number({ style: 'international' }),
				email: faker.internet.email(),
				password: faker.internet.password(),
				created_at: new Date(),
				updated_at: new Date(),
			});
			gender = gender === 4 ? 1 : gender + 1;
		}
		await queryInterface.bulkInsert('users', users, {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('Users', null, {});
	},
};
