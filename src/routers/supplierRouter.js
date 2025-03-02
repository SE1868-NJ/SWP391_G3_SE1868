const express = require('express');
const router = express.Router();
const SupplierController = require('../controller/SupplierController');

router.get('/', SupplierController.getAllSuppliers);
router.get('/paginated', SupplierController.getSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.post('/create', SupplierController.createSupplier);
router.post('/update/:id', SupplierController.updateSupplier);
router.post('/:id', SupplierController.deleteSupplier);

module.exports = router;
