import * as path from 'path'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import * as s3 from '@aws-cdk/aws-s3'
import { CustomResource, Stack } from '@aws-cdk/core'
import { Construct, Node } from 'constructs'
import * as cr from '@aws-cdk/custom-resources'
import { Construct as CoreConstruct } from '@aws-cdk/core'

interface S3FileProps {
    /**
     * The bucket in which the file will be created.
     */
    readonly bucket: s3.IBucket

    /**
     * The object key.
     *
     * @default - automatically-generated
     */
    readonly objectKey?: string

    /**
     * The contents of the file.
     */
    readonly contents: string

    /**
     * MIME type
     */
    readonly contentType?: string

    /**
     * Cache control header for the object.
     */
    readonly cacheControl?: string

    /**
     * Indicates if this file should have public-read permissions.
     *
     * @default false
     */
    readonly public?: boolean
}

export class S3File extends CoreConstruct {
    public readonly cacheControl: string
    public readonly objectKey: string
    public readonly contentType: string
    public readonly url: string
    public readonly etag: string

    constructor(scope: Construct, id: string, props: S3FileProps) {
        super(scope, id)

        const resource = new CustomResource(this, 'Resource', {
            serviceToken: S3FileProvider.getOrCreate(this),
            resourceType: 'Custom::S3File',
            properties: {
                ['BucketName']: props.bucket.bucketName,
                ['Contents']: props.contents,
                ['ObjectKey']: props.objectKey,
                ['PublicRead']: props.public,
                ['ContentType']: props.contentType,
                ['CacheControl']: props.cacheControl,
            },
        })

        this.objectKey = resource.getAttString('ObjectKey')
        this.url = resource.getAttString('URL')
        this.etag = resource.getAttString('ETag')
        this.contentType = props.contentType || ''
        this.cacheControl = props.cacheControl || ''
    }
}

class S3FileProvider extends CoreConstruct {
    public static getOrCreate(scope: Construct) {
        const stack = Stack.of(scope)
        const id = 'com.amazonaws.cdk.custom-resources.s3file-provider'
        const x =
            (Node.of(stack).tryFindChild(id) as S3FileProvider) || new S3FileProvider(stack, id)
        return x.provider.serviceToken
    }

    private readonly provider: cr.Provider

    constructor(scope: Construct, id: string) {
        super(scope, id)

        this.provider = new cr.Provider(this, 's3file-provider', {
            onEventHandler: new lambda.Function(this, 's3file-on-event', {
                code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
                runtime: lambda.Runtime.NODEJS_10_X,
                handler: 'index.onEvent',
                initialPolicy: [
                    new iam.PolicyStatement({
                        resources: ['*'],
                        actions: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                            's3:DeleteObject*',
                            's3:PutObject*',
                            's3:Abort*',
                        ],
                    }),
                ],
            }),
        })
    }
}
