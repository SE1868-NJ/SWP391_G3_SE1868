const db = require('../models');
const { Op } = require('sequelize');

class BannerRepository {
	constructor() { }

	async getAllBanners() {
		return await db.Banner.findAll({
			include: [
				{ model: db.Shop, as: 'shop' }
			]
		});
	}

	async getBanners(params) {
		const { page = 1, limit = 10, shopId } = params;

		const whereClause = {};
		if (shopId) {
			whereClause.shop_id = shopId;
		}

		const { count, rows } = await db.Banner.findAndCountAll({
			where: whereClause,
			include: [
				{ model: db.Shop, as: 'shop' }
			],
			limit: parseInt(limit),
			offset: (page - 1) * limit,
		});

		return {
			items: rows,
			metadata: {
				total: count,
				page: parseInt(page),
				limit: parseInt(limit),
				totalPages: Math.ceil(count / limit),
			},
		};
	}

	async getActiveShopBanners(shopId) {
		const currentDate = new Date();

		return await db.Banner.findAll({
			where: {
				shop_id: shopId,
				is_active: true,
				[Op.and]: [
					{
						[Op.or]: [
							{ start_date: null },
							{ start_date: { [Op.lte]: currentDate } }
						]
					},
					{
						[Op.or]: [
							{ end_date: null },
							{ end_date: { [Op.gte]: currentDate } }
						]
					}
				]
			},
			order: [['id', 'DESC']]
		});
	}

	async getBannerById(id) {
		return await db.Banner.findByPk(id, {
			include: [
				{ model: db.Shop, as: 'shop' }
			]
		});
	}

	async createBanner(data) {
		try {
			return await db.Banner.create({
				shop_id: data.shop_id,
				title: data.title,
				image_url: data.image_url,
				start_date: data.start_date,
				end_date: data.end_date,
				is_active: data.is_active !== undefined ? data.is_active : true
			});
		} catch (error) {
			throw error;
		}
	}

	async updateBanner(id, data) {
		const banner = await db.Banner.findByPk(id);
		if (!banner) return null;

		await banner.update(data);
		return banner;
	}

	async deleteBanner(id) {
		const banner = await db.Banner.findByPk(id);
		if (!banner) return null;

		await banner.destroy();
		return true;
	}
}

module.exports = new BannerRepository();