const { validationResult } = require('express-validator');

class BaseController {

    convertToJson(res, statusCode, data) {
        return res.status(statusCode).json({
            status: statusCode === 200 ? 'success' : 'error',
            data,
        });
    }

    validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array(),
            });
        }
        next();
    }

    handleError(res, error) {
        console.error(error); 
        return this.convertToJson(res, 500, { message: error.message || 'Internal Server Error' });
    }
}
module.exports = BaseController;