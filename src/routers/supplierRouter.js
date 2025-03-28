const express = require('express');
const router = express.Router();
const SupplierController = require('../controller/SupplierController');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, SupplierController.getAllSuppliers);
router.get('/get_list_supplier', verifyToken, SupplierController.getSuppliers);
router.get('/:id', verifyToken, SupplierController.getSupplierById);
router.post('/create', verifyToken, SupplierController.createSupplier);
router.post('/update/:id', verifyToken, SupplierController.updateSupplier);
router.post('/:id', verifyToken, SupplierController.deleteSupplier);

module.exports = router;
