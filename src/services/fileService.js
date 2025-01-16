const minioClient = require('../config/minio');
// const File = require('../models/File');
const crypto = require('crypto');
const path = require('path');

class FileService {
    constructor() {
        this.bucketName = process.env.MINIO_BUCKET_NAME || null;
    }

    async uploadFile(file) {
        try {
            const objectName = Date.now() + "_" + file.originalname;

            // Upload to MinIO
            await minioClient.putObject(
                this.bucketName,
                objectName,
                file.buffer
            );

            // Get file URL
            const fileUrl = await this.getFileUrl(this.bucketName, objectName);

            return {
                filename: objectName,
                url: fileUrl,
                size: file.size
            };
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    async getFileUrl(bucket, filename) {
        try {
            const fileUrl = await minioClient.presignedGetObject(bucket, filename, 1*60);
            
            return fileUrl.replace('minio', 'localhost').split('?')[0];
        } catch (error) {
            console.log('Get file URL error:', error);
            throw new Error(`Get file URL failed: ${error.message}`);
        }
    }
}

module.exports = new FileService();