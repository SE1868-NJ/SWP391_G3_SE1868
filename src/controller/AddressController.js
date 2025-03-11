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
}

module.exports = new AddressController();