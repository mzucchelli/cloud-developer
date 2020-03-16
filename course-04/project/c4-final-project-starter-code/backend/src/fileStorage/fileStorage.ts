import * as AWS from 'aws-sdk'

// when I import like this, I get an error:
// Property 'DocumentClient' does not exist on type 'PatchedAWSClientConstructor<ClientConfiguration, typeof DynamoDB>'
// on the line with new XAWS.DynamoDB.DocumentClient() below
//import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

export class FileStorage {
    constructor(
        private readonly logger = createLogger('get-todos'),
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
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
