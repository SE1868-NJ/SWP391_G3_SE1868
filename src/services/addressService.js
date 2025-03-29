const provinceRepository = require('../repositories/ProvinceRepository');
const districtRepository = require('../repositories/DistrictRepository');
const wardRepository = require('../repositories/WardRepository');
const addressRepository = require('../repositories/AddressRepository');

class AddressService {
    constructor() {

    }
    async getAllProvinces() {
        try {
            const provinces = await provinceRepository.getAllProvinces();
            if (!provinces) {
                throw new Error('Provinces not found');
            }
            return provinces;
        } catch (error) {
            console.log(error);
        }
    }

    async getDistrictsByProvinceId(provinceId) {
        try {
            const districts = await districtRepository.getDistrictsByProvinceId(provinceId);
            if (!districts) {
                throw new Error('Districts not found');
            }
            return districts;
        } catch (error) {
            console.log(error);
        }
    }

    async getWardsByDistrictId(districtId) {
        try {
            const wards = await wardRepository.getWardsByDistrictId(districtId);
            if (!wards) {
                throw new Error('Wards not found');
            }
            return wards;
        } catch (error) {
            console.log(error);
        }
    }

    async createAddress(data) {
        try {
            const address = await addressRepository.createAddress(data);
            if (!address) {
                throw new Error('Address not created');
            }
            return address;
        } catch (error) {
            console.log(error);
        }
    }

    async getAddressesByUserId(userId) {
        try {
            const addresses = await addressRepository.getAddressesByUserId(userId);
            if (!addresses) {
                throw new Error('Addresses not found');
            }
            return addresses;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new AddressService();