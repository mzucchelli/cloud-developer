import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

export class FileStorage {
    constructor(
        private readonly logger = createLogger('get-todos'),
        private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
    ) { }

    generateUploadUrl(todoId: string): string {
        this.logger.info('generating uploadUrl', { todoId, bucketName: this.bucketName })

        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })

        this.logger.info('url generated', { todoId, bucketName: this.bucketName })

        return uploadUrl
    }
}
