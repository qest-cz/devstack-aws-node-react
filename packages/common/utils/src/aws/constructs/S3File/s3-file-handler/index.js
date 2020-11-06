/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const putObject = async (event) => {
    const bucketName = event.ResourceProperties['BucketName']
    if (!bucketName) {
        throw new Error('"BucketName" is required')
    }

    const contents = event.ResourceProperties['Contents']
    if (!contents) {
        throw new Error('"Contents" is required')
    }

    let objectKey =
        event.ResourceProperties['ObjectKey'] ||
        event.LogicalResourceId + '-' + event.RequestId.replace(/-/g, '') + '.txt'

    if (objectKey.startsWith('/')) {
        objectKey = objectKey.substr(1)
    }

    const publicRead = event.ResourceProperties['PublicRead'] || false
    const contentType = event.ResourceProperties['ContentType'] || undefined
    const cacheControl = event.ResourceProperties['CacheControl'] || undefined

    console.log(`writing s3://${bucketName}/${objectKey}`)

    const resp = await s3
        .putObject({
            Bucket: bucketName,
            Key: objectKey,
            Body: contents,
            ACL: publicRead ? 'public-read' : undefined,
            ...(contentType && { ContentType: contentType }),
            ...(cacheControl && { CacheControl: cacheControl }),
        })
        .promise()

    return {
        PhysicalResourceId: objectKey,
        Data: {
            ['ObjectKey']: objectKey,
            ['ETag']: resp.ETag,
            ['URL']: `https://${bucketName}.s3.amazonaws.com/${objectKey}`,
        },
    }
}

const deleteObject = async (event) => {
    const bucketName = event.ResourceProperties.BucketName
    if (!bucketName) {
        throw new Error('"BucketName" is required')
    }

    const objectKey = event.PhysicalResourceId
    if (!objectKey) {
        throw new Error('PhysicalResourceId expected for DELETE events')
    }

    await s3
        .deleteObject({
            Bucket: bucketName,
            Key: objectKey,
        })
        .promise()
}

exports.onEvent = async (event) => {
    // eslint-disable-next-line default-case
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return putObject(event)

        case 'Delete':
            return deleteObject(event)
    }
}

exports.putObject = putObject

exports.deleteObject = deleteObject
