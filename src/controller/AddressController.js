const BaseController = require('./baseController');
const addressService = require('../services/addressService');

class AddressController extends BaseController {

    getProvinces = async (req, res) => {
        try {
            const result = await addressService.getAllProvinces();
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getDistrictsByProvinceId = async (req, res) => {
        try {
            const provinceId = parseInt(req.params.provinceId);

            const result = await addressService.getDistrictsByProvinceId(provinceId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getWardsByDistrictId = async (req, res) => {
        try {
            const districtId = parseInt(req.params.districtId);

            const result = await addressService.getWardsByDistrictId(districtId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    createAddress = async (req, res) => {
        try {
            const data = req.body;

            const result = await addressService.createAddress(data);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getAddressesByUserId = async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);

            const result = await addressService.getAddressesByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

module.exports = new AddressController();