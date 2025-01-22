const fileService = require('../services/fileService');
const BaseController = require('./baseController');

class FileController extends BaseController {

    constructor() {
        super();
    }

    uploadFile = async (req, res) => {
        const {shopName} = req.body;
        try {
            if (!req.file || !shopName) {
                return this.convertToJson(res, 400, { message: 'No file uploaded' });
            }
            
            const result = await fileService.uploadFile(req.file, shopName);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
    
    getFileUrl = async (req, res) => {
        try {
            const { bucket, fileName } = req.params;
            const fileUrl = await fileService.getFileUrl(bucket, fileName);
            return this.convertToJson(res, 200, fileUrl);
        } catch (error) {
            return this.handleError(res, error.message);
        }
    };
    
    // listFiles = async (req, res) => {
    //     try {
    //         const files = await fileService.listFiles();
    //         return this.convertToJson(res, 200, { data: files });
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // };
    
}

module.exports = new FileController();