const fileService = require('../services/fileService');
const BaseController = require('./baseController');

class FileController extends BaseController {

    constructor() {
        super();
    }

    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return super.convertToJson(res, 400, { message: 'No file uploaded' });
            }

            const result = await fileService.uploadFile(req.file);

            return super.convertToJson(res, 201, result);
        } catch (error) {
            return super.handleError(res, error);
        }
    }

    async getFileUrl(req, res) {
        try {
            const { bucket, fileName } = req.params;
            const fileUrl = await fileService.getFileUrl(bucket, fileName);

            return super.convertToJson(res, 200, fileUrl);
        } catch (error) {
            return super.handleError(res, error.message);
        }
    }

    // async listFiles(req, res) {
    //     try {
    //         const files = await fileService.listFiles();

    //         res.json({
    //             success: true,
    //             data: files
    //         });
    //     } catch (error) {
    //         console.error('List files error:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }
}

module.exports = new FileController();