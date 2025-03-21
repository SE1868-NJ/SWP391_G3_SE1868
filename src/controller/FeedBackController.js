const feedbackService = require('../services/feedBackService');
const BaseController = require('./baseController');

class FeedBackController extends BaseController {

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
    createFeedback = async (req, res) => {
        try {
            // Lấy thông tin người dùng từ token JWT (nếu có authentication)
            // const user_id = req.user?.id; // Nếu bạn đang sử dụng JWT authentication
            
            // Lấy dữ liệu từ body và files
            const user_id = parseInt(req.body.user_id);
            const product_id = parseInt(req.body.product_id);
            const rating = parseInt(req.body.rating);
            const comment = req.body.comment?.trim();
            const is_update = req.body.is_update ? parseInt(req.body.is_update) : 0;
    
            // Validation
            if (isNaN(user_id) || user_id <= 0) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'User ID không hợp lệ'
                });
            }
            
            if (isNaN(product_id) || product_id <= 0) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'Product ID không hợp lệ'
                });
            }
            
            if (isNaN(rating) || rating < 1 || rating > 5) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'Đánh giá phải từ 1 đến 5 sao'
                });
            }
            
            if (!comment || comment === '') {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'Nội dung đánh giá là bắt buộc'
                });
            }
    
            // Lấy danh sách file đã upload
            const images = req.files?.['images'] || [];
            const videos = req.files?.['videos'] || [];
    
            // Kiểm tra giới hạn số lượng file (nếu cần)
            if (images.length > 5) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'Chỉ cho phép tối đa 5 hình ảnh'
                });
            }
            
            if (videos.length > 2) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: 'Chỉ cho phép tối đa 2 video'
                });
            }
    
            // Tạo mảng media từ các file đã upload
            const media = [
                ...images.map(file => ({
                    media_url: `/uploads/${file.filename}`,
                    media_type: 'image'
                })),
                ...videos.map(file => ({
                    media_url: `/uploads/${file.filename}`,
                    media_type: 'video'
                }))
            ];
    
            const feedbackData = {
                user_id,
                product_id,
                rating,
                comment,
                is_update,
                media: media.length > 0 ? media : null
            };
    
            // Gọi service để tạo feedback
            const result = await feedbackService.createFeedback(feedbackData);
    
            // Trả về kết quả thành công
            return this.convertToJson(res, 201, {
                success: true,
                message: 'Đánh giá sản phẩm đã được tạo thành công',
                data: result
            });
        } catch (error) {
            console.error('Controller error - createFeedback:', error);
            
            // Xử lý lỗi validation từ service
            if (error.message.includes('bắt buộc') || 
                error.message.includes('từ 1 đến 5') || 
                error.message.includes('không hợp lệ')) {
                return this.convertToJson(res, 400, {
                    success: false,
                    message: error.message
                });
            }
            
            return this.handleError(res, error);
        }
    }
}

module.exports = new FeedBackController();