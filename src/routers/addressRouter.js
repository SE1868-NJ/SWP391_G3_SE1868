const express = require('express');
const router = express.Router();
const AddressController = require('../controller/AddressController');

router.get('/provinces', AddressController.getProvinces);
router.get('/districts/:provinceId', AddressController.getDistrictsByProvinceId);
router.get('/wards/:districtId', AddressController.getWardsByDistrictId);
router.post('/create-address', AddressController.createAddress);
router.get('/addresses/:userId', AddressController.getAddressesByUserId);

module.exports = router;