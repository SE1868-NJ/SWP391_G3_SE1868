const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controller/fileController');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/getFile/:bucket/:fileName', fileController.getFileUrl);

module.exports = router;