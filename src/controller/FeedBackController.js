const feedbackService = require('../services/feedBackService');
const BaseController = require('./baseController');
const path = require('path');
const fs = require('fs');

class FeedBackController extends BaseController {
    constructor() {
        super();
    }

    // getFeedBacks = async (req, res) => {
    //     try {
    //         const params = { page: parseInt(req.body.page), product_id: parseInt(req.body.product_id) };

    //         const result = await feedbackService.getFeedBacks(params);
    //         this.convertToJson(res, 200, result);
    //     } catch (error) {
    //         this.handleError(res, error);
    //     }
    // }
    getFeedBacksByProductId = async (req, res) => {
        try {
            const product_id = parseInt(req.params.id);

            const result = await feedbackService.getFeedBacks(product_id);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
    submitFeedback = async (req, res) => {
        try {
            const { user_id, product_id, rating, comment } = req.body;

            if (!user_id) {
                throw new Error('User ID is required');
            }

            // Khởi tạo mảng để lưu đường dẫn ảnh
            let imageUrls = [];

            // Xử lý upload nhiều file ảnh
            if (req.files && req.files.images) {
                // Tạo thư mục uploads nếu chưa tồn tại
                const uploadDir = path.join(__dirname, '../uploads/feedback_images');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Xử lý trường hợp một file hoặc nhiều file
                const imageFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                // Lưu từng file và lấy đường dẫn
                for (const imageFile of imageFiles) {
                    const fileName = `feedback_${user_id}_${Date.now()}_${imageFile.name}`;
                    const uploadPath = path.join(uploadDir, fileName);

                    await imageFile.mv(uploadPath);
                    imageUrls.push(`http://localhost:4000/uploads/feedback_images/${fileName}`);
                }
            }

            const feedbackData = {
                user_id: parseInt(user_id),
                product_id: parseInt(product_id),
                rating: parseFloat(rating),
                comment: comment || '',
                images: imageUrls,
            };

            const result = await feedbackService.submitFeedback(feedbackData);
            this.convertToJson(res, 201, { message: 'Gửi đánh giá thành công!', feedback: result });
        } catch (error) {
            this.handleError(res, error);
        }
    };

    convertToJson(res, code, data) {
        res.status(code).json({
            status: code >= 400 ? 'error' : 'success',
            data: data
        });
    }

}

module.exports = new FeedBackController();