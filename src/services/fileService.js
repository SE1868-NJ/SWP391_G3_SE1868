const minioClient = require('../config/minio');

class FileService {
    constructor() {
        this.bucketName = 'data';
        this.minioEndpoint = 'http://127.0.0.1:9000';
    }

    async uploadFile(file, prefix_name) {
        try {
            const originalName = file.originalname || file.name;
            const objectName = `${prefix_name}/${Date.now()}_${originalName}`;
            const fileBuffer = file.buffer || file.data;

            const bucketExists = await minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(this.bucketName);
            }

            await minioClient.putObject(
                this.bucketName,
                objectName,
                fileBuffer,
                file.size
            );

            const fileUrl = `${this.minioEndpoint}/${this.bucketName}/${objectName}`;

            return {
                success: true,
                filename: objectName,
                url: fileUrl,
                size: file.size,
                mimetype: file.mimetype
            };
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    async getFileUrl(bucket, filename) {
        try {
            const directUrl = `${this.minioEndpoint}/${bucket}/${filename}`;
            return directUrl;
        } catch (error) {
            throw new Error(`Failed to get file: ${error.message}`);
        }
    }
}

module.exports = new FileService();